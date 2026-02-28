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
        const demoEmail = process.env.DEMO_EMAIL;
        const demoPassword = process.env.DEMO_PASSWORD;

        if (!demoEmail || !demoPassword) return null;
        if (!credentials?.email || !credentials?.password) return null;

        if (
          credentials.email === demoEmail &&
          credentials.password === demoPassword
        ) {
          const requestedRole = credentials.role;
          const role: AppRole = isValidRole(requestedRole)
            ? requestedRole
            : "host";

          return {
            id: `demo-${role}`,
            name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
            email: demoEmail,
            role,
          };
        }

        return null;
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as AppRole;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
