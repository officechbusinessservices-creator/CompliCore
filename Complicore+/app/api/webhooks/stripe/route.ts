import { headers } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const supabase = createServerComponentClient({ cookies });

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === 'paid' && session.metadata?.workspace_id) {
          // Update subscription in database
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              stripe_customer_id: session.customer as string,
              activation_fee_paid: true,
            })
            .eq('workspace_id', session.metadata.workspace_id);

          if (error) {
            console.error('Error updating subscription:', error);
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.customer) {
          // Update invoice record
          const { error } = await supabase.from('invoices').upsert(
            {
              stripe_invoice_id: invoice.id,
              stripe_customer_id: invoice.customer as string,
              amount: invoice.total || 0,
              currency: invoice.currency || 'usd',
              status: 'paid',
              issued_at: new Date(invoice.created * 1000).toISOString(),
              invoice_url: invoice.hosted_invoice_url || '',
            },
            { onConflict: 'stripe_invoice_id' }
          );

          if (error) {
            console.error('Error updating invoice:', error);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.customer) {
          // Update invoice record with failed status
          const { error } = await supabase.from('invoices').upsert(
            {
              stripe_invoice_id: invoice.id,
              stripe_customer_id: invoice.customer as string,
              amount: invoice.total || 0,
              currency: invoice.currency || 'usd',
              status: 'failed',
              issued_at: new Date(invoice.created * 1000).toISOString(),
              invoice_url: invoice.hosted_invoice_url || '',
            },
            { onConflict: 'stripe_invoice_id' }
          );

          if (error) {
            console.error('Error updating invoice:', error);
          }

          // Mark subscription as past_due
          const { error: subError } = await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_customer_id', invoice.customer as string);

          if (subError) {
            console.error('Error updating subscription status:', subError);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.customer) {
          // Cancel subscription in database
          const { error } = await supabase
            .from('subscriptions')
            .update({ status: 'canceled' })
            .eq('stripe_customer_id', subscription.customer as string);

          if (error) {
            console.error('Error canceling subscription:', error);
          }
        }
        break;
      }
    }

    return new Response('Webhook processed', { status: 200 });
  } catch (err) {
    const error = err as Error;
    console.error('Webhook error:', error);
    return new Response(`Error processing webhook: ${error.message}`, {
      status: 500,
    });
  }
}
