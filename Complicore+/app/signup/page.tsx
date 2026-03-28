'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { getSupabaseClient } from '@/lib/auth-client';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = getSupabaseClient();

      // Sign up user
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Create workspace for user
      if (data.user) {
        const { error: workspaceError } = await supabase
          .from('workspaces')
          .insert({
            owner_id: data.user.id,
            name: `${name}'s Workspace`,
          });

        if (workspaceError) {
          setError('Failed to create workspace');
          setLoading(false);
          return;
        }

        // Create user record
        const { error: userError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          full_name: name,
          workspace_id: data.user.id, // Will be updated to actual workspace ID
        });

        if (userError) {
          console.error('Error creating user record:', userError);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login?signup=success');
      }, 2000);
    } catch (err) {
      setError('An error occurred during signup');
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas px-16">
        <div className="w-full max-w-400 text-center">
          <div className="mb-24 flex justify-center">
            <CheckCircle className="w-64 h-64 text-[#22C55E]" />
          </div>
          <h1 className="text-h3 font-semibold text-text-primary mb-8">
            Account created
          </h1>
          <p className="text-body text-text-secondary mb-24">
            Check your email to verify your account. You'll be redirected to
            login shortly.
          </p>
          <p className="text-small text-text-secondary/60">
            Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-16">
      <div className="w-full max-w-400">
        {/* Header */}
        <div className="mb-40">
          <h1 className="text-h3 font-semibold text-text-primary mb-8">
            Create account
          </h1>
          <p className="text-body text-text-secondary">
            Sign up for CompliCore+ and activate your first workflow
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-24 p-16 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-12 flex gap-12">
            <AlertCircle className="w-20 h-20 text-[#EF4444] flex-shrink-0" />
            <div>
              <p className="text-small font-medium text-[#EF4444]">
                Signup failed
              </p>
              <p className="text-small text-[#EF4444]/80 mt-4">{error}</p>
            </div>
          </div>
        )}

        {/* Signup form */}
        <form onSubmit={handleSignup} className="space-y-24">
          {/* Name field */}
          <div>
            <label
              htmlFor="name"
              className="block text-small font-medium text-text-secondary mb-8"
            >
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-16 top-12 w-20 h-20 text-text-secondary pointer-events-none" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                required
                disabled={loading}
                className="w-full pl-40 pr-16 py-12 bg-surface border border-border rounded-8 text-body text-text-primary placeholder-text-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
              />
            </div>
          </div>

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-small font-medium text-text-secondary mb-8"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-16 top-12 w-20 h-20 text-text-secondary pointer-events-none" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                disabled={loading}
                className="w-full pl-40 pr-16 py-12 bg-surface border border-border rounded-8 text-body text-text-primary placeholder-text-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-small font-medium text-text-secondary mb-8"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-16 top-12 w-20 h-20 text-text-secondary pointer-events-none" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
                className="w-full pl-40 pr-16 py-12 bg-surface border border-border rounded-8 text-body text-text-primary placeholder-text-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
              />
            </div>
            <p className="text-caption text-text-secondary/60 mt-8">
              Minimum 6 characters
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !email || !password || !name}
            className="w-full py-12 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white text-body font-medium rounded-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          {/* Sign in link */}
          <p className="text-center text-small text-text-secondary">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-primary hover:text-primary/90 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>

        {/* Terms note */}
        <div className="mt-40 p-16 bg-elevated-surface/40 border border-border rounded-12">
          <p className="text-caption text-text-secondary">
            By signing up, you agree to our Terms of Service and Privacy
            Policy. We'll send you a verification email to activate your
            account.
          </p>
        </div>
      </div>
    </div>
  );
}
