'use client'

import { useState } from 'react'
import { ArrowLeft, CheckCircle, Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Reset Password | CompliCore+',
  description: 'Reset your CompliCore+ account password.',
  openGraph: {
    title: 'Reset Password | CompliCore+',
    description: 'Reset your CompliCore+ account password.',
    url: 'https://complicore.ai/reset-password',
    type: 'website',
  },
}

type ResetStep = 'email' | 'token' | 'success' | 'error'

export default function ResetPasswordPage() {
  const [step, setStep] = useState<ResetStep>('email')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    try {
      // TODO: Call password reset API endpoint
      // POST /api/auth/forgot-password with { email }
      // Response: { success: true, message: "Reset link sent to email" }
      await new Promise(resolve => setTimeout(resolve, 800))
      setStep('token')
    } catch (err) {
      setError('Error sending reset link. Please try again.')
      console.error('Reset email error:', err)
    } finally {
      setLoading(false)
    }
  }

  const validatePassword = (pwd: string): boolean => {
    if (pwd.length < 8) {
      setPasswordError('Password must be at least 8 characters.')
      return false
    }
    if (!/[A-Z]/.test(pwd)) {
      setPasswordError('Password must include an uppercase letter.')
      return false
    }
    if (!/[0-9]/.test(pwd)) {
      setPasswordError('Password must include a number.')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setPasswordError('')

    if (!token || !password || !confirmPassword) {
      setError('All fields are required.')
      return
    }

    if (!validatePassword(password)) {
      return
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      // TODO: Call password reset confirmation API endpoint
      // POST /api/auth/reset-password with { token, password }
      // Response: { success: true, message: "Password reset successful" }
      await new Promise(resolve => setTimeout(resolve, 800))
      setStep('success')
    } catch (err) {
      setError('Error resetting password. Please try again or request a new link.')
      console.error('Reset error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Back */}
        <div className="mb-8">
          <Link href="/login" className="inline-flex items-center text-14 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-line bg-surface p-8">
          {/* Step 1: Email */}
          {step === 'email' && (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-24 font-bold text-tp">Forgot your password?</h1>
                <p className="text-14 text-ts mt-2">
                  Enter your email and we'll send you a link to reset it.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-14 font-semibold text-tp mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@riverside.com"
                    className="w-full px-4 py-3 bg-canvas border border-line rounded-lg text-14 text-tp placeholder:text-ts focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {error && (
                  <div className="flex gap-3 p-3 rounded-lg bg-danger/5 border border-danger/20">
                    <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                    <p className="text-12 text-danger">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold text-14 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>

                <p className="text-12 text-ts text-center">
                  Check your email for a link to reset your password. The link expires in 24 hours.
                </p>
              </form>
            </>
          )}

          {/* Step 2: Reset Token */}
          {step === 'token' && (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-24 font-bold text-tp">Create a new password</h1>
                <p className="text-14 text-ts mt-2">
                  Enter the code from your email and set a new password.
                </p>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-14 font-semibold text-tp mb-2">
                    Reset code
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste code from email"
                    className="w-full px-4 py-3 bg-canvas border border-line rounded-lg text-14 text-tp placeholder:text-ts focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-14 font-semibold text-tp mb-2">
                    New password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setPasswordError('')
                    }}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-canvas border border-line rounded-lg text-14 text-tp placeholder:text-ts focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-14 font-semibold text-tp mb-2">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setPasswordError('')
                    }}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-canvas border border-line rounded-lg text-14 text-tp placeholder:text-ts focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="p-3 rounded-lg bg-canvas border border-line">
                  <p className="text-12 text-ts">Password must include:</p>
                  <ul className="mt-2 space-y-1 text-12 text-ts">
                    <li className={password.length >= 8 ? 'text-success' : 'text-ts'}>
                      ✓ At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(password) ? 'text-success' : 'text-ts'}>
                      ✓ One uppercase letter
                    </li>
                    <li className={/[0-9]/.test(password) ? 'text-success' : 'text-ts'}>
                      ✓ One number
                    </li>
                  </ul>
                </div>

                {error && (
                  <div className="flex gap-3 p-3 rounded-lg bg-danger/5 border border-danger/20">
                    <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                    <p className="text-12 text-danger">{error}</p>
                  </div>
                )}

                {passwordError && (
                  <div className="flex gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
                    <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <p className="text-12 text-warning">{passwordError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold text-14 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset password'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('email')
                    setEmail('')
                    setError('')
                  }}
                  className="w-full py-2 text-14 text-primary hover:text-primary/80 transition-colors"
                >
                  Use a different email?
                </button>
              </form>
            </>
          )}

          {/* Success State */}
          {step === 'success' && (
            <>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <h1 className="text-24 font-bold text-tp mb-2">Password reset</h1>
                <p className="text-14 text-ts mb-8">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold text-14 hover:bg-primary/90 transition-colors"
                >
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-12 text-ts">
          <p>
            Need help?{' '}
            <Link href="mailto:support@complicore.ai" className="text-primary hover:text-primary/80 transition-colors">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
