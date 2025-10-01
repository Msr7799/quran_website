import NextAuth from "next-auth/next";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Google from "next-auth/providers/google";
import client from "./lib/db";

const authConfig = {
  adapter: MongoDBAdapter(client),
  providers: [
    // Google Provider مفعّل
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    // مثال على GitHub Provider (تحتاج GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET في .env)
    /*
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    */
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin', // Redirect errors to signin page
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await client.db("quran_newsletter").collection("users").findOne({
        email: token.email,
      });

      if (!dbUser) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);;
