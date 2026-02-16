import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "./auth-utils"; // utility to check password

import { db } from "~/server/db";
import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider,
    CredentialsProvider({
  name: "Username & Password",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials) return null;

    // Cast to string
    const username = String(credentials.username);
    const password = String(credentials.password);

    const user = await db.user.findUnique({
      where: { username }, // now TypeScript knows it's a string
    });

    if (!user) return null;

    const isValid = await verifyPassword(password, user.passwordHash!); 
    // use `!` if passwordHash is guaranteed to exist

    if (!isValid) return null;

    return { id: user.id, username: user.username, email: user.email };
  },
})


    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Google provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(db),
  callbacks: {
  async jwt({ token, user }) {
    // Runs on login
    if (user) {
      token.id = user.id;
    }
    return token;
  },

  session: ({ session, token }) => ({
    ...session,
    user: {
      ...session.user,
      id: token.id as string,
    },
  }),
},
  cookies: {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      secure: env.NODE_ENV === "production",
    },
  },
},

  
  
} satisfies NextAuthConfig;
