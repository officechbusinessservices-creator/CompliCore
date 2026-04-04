import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isValidRole, type AppRole } from "@/lib/rbac";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

        try {
          const response = await fetch(`${apiBase}/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) return null;

          const data = await response.json();
          if (!data.user || !data.accessToken) return null;

          // Use the role from the requested credential field if valid,
          // otherwise fall back to the user's primary role from the backend.
          const backendRole = data.user.roles?.[0] || "guest";
          const requestedRole = credentials.role;
          const role: AppRole = isValidRole(requestedRole) ? requestedRole : backendRole;

          return {
            id: String(data.user.id),
            name: data.user.displayName || `${data.user.firstName} ${data.user.lastName}`.trim(),
            email: data.user.email,
            role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: AppRole }).role;
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.refreshToken = (user as { refreshToken?: string }).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as AppRole;
      }
      // Expose the backend access token on the session so API calls can use it
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
