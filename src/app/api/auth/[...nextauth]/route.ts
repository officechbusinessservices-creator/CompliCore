import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const demoEmail = process.env.DEMO_EMAIL;
        const demoPassword = process.env.DEMO_PASSWORD;

        if (!demoEmail || !demoPassword) return null;
        if (!credentials?.email || !credentials?.password) return null;

        if (credentials.email === demoEmail && credentials.password === demoPassword) {
          return {
            id: "demo-user",
            name: "Demo User",
            email: demoEmail,
            role: "host",
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
});

export { handler as GET, handler as POST };
