import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../../lib/prisma"; // Corrected import path
import { AuthOptions } from 'next-auth'; // Import AuthOptions for typing

export const authOptions: AuthOptions = { // Add AuthOptions type
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          // No user found, or user signed up with OAuth and doesn't have a password set
          console.log('No user found or no password set for user:', credentials.email);
          return null;
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          console.log('Invalid password for user:', credentials.email);
          return null;
        }

        // Return user object if authentication is successful
        // The object returned here will be available in the jwt callback `user` parameter
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          // You can add other properties here if needed for the session/token
        };
      }
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT strategy
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user id to the token right after signin
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from the token.
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      // You could also add other properties from the token to session.user here
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
