import { CreditCard } from 'lucide-react';

export default function PaymentMethod() {
  return (
    <div className="bg-surface rounded-16 border border-border p-24 lg:p-32">
      <h2 className="text-label-large font-semibold text-text-primary mb-24">Payment Method</h2>

      {/* Mock card display */}
      <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-12 p-24 border border-primary/20 mb-24">
        <div className="flex items-start justify-between mb-32">
          <CreditCard className="w-24 h-24 text-primary" />
          <span className="text-small font-medium text-primary">VISA</span>
        </div>

        <div className="mb-16">
          <p className="text-caption text-text-secondary mb-4">Card number</p>
          <p className="text-body font-medium text-text-primary">•••• •••• •••• 4242</p>
        </div>

        <div className="grid grid-cols-2 gap-24">
          <div>
            <p className="text-caption text-text-secondary mb-4">Expires</p>
            <p className="text-body font-medium text-text-primary">12/27</p>
          </div>
          <div>
            <p className="text-caption text-text-secondary mb-4">Cardholder</p>
            <p className="text-body font-medium text-text-primary">Alex Johnson</p>
          </div>
        </div>
      </div>

      {/* Update button */}
      <button className="w-full px-16 py-12 bg-primary hover:bg-primary/90 text-white text-body font-medium rounded-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
        Update Payment Method
      </button>

      {/* Info text */}
      <p className="text-small text-text-secondary mt-16">
        Your payment method is securely stored and encrypted. We never store your full card number.
      </p>
    </div>
  );
}
