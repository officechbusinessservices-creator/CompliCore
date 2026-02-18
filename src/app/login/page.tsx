"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
    if (result?.error) setError("Invalid credentials");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground">Use demo credentials from .env.local</p>
        </div>
        {error && <p className="text-sm text-rose-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm">Email</label>
            <input
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Password</label>
            <input
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="w-full rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
