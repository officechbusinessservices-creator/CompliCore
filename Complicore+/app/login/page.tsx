'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { getSupabaseClient } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = getSupabaseClient();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Redirect to dashboard on successful login
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred during login');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-16">
      <div className="w-full max-w-400">
        {/* Header */}
        <div className="mb-40">
          <h1 className="text-h3 font-semibold text-text-primary mb-8">
            Sign in
          </h1>
          <p className="text-body text-text-secondary">
            Access your CompliCore+ dashboard
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-24 p-16 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-12 flex gap-12">
            <AlertCircle className="w-20 h-20 text-[#EF4444] flex-shrink-0" />
            <div>
              <p className="text-small font-medium text-[#EF4444]">
                Login failed
              </p>
              <p className="text-small text-[#EF4444]/80 mt-4">{error}</p>
            </div>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-24">
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
                className="w-full pl-40 pr-16 py-12 bg-surface border border-border rounded-8 text-body text-text-primary placeholder-text-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
              />
            </div>
            <Link
              href="/reset-password"
              className="inline-block mt-8 text-small text-primary hover:text-primary/90 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-12 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white text-body font-medium rounded-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Sign up link */}
          <p className="text-center text-small text-text-secondary">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-primary hover:text-primary/90 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </form>

        {/* Demo credentials */}
        <div className="mt-40 p-16 bg-elevated-surface/40 border border-border rounded-12">
          <p className="text-caption text-text-secondary font-medium mb-8">
            Demo credentials
          </p>
          <p className="text-caption text-text-secondary mb-4">
            <span className="text-text-primary">Email:</span> demo@complicore.plus
          </p>
          <p className="text-caption text-text-secondary">
            <span className="text-text-primary">Password:</span> demo123456
          </p>
        </div>
      </div>
    </div>
  );
}
