// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import { compare } from "bcrypt";
import User from "@/models/User";
import connectDB from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "Captcha Token", type: "text" },
      },
      async authorize(credentials) {
        await connectDB();

        // ✅ Validate captcha
        const captcha = await verifyTurnstile(credentials.captchaToken);
        if (!captcha.success) {
          throw new Error(captcha.error || "Captcha verification failed.");
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("All fields are required.");
        }

        // Find user by email or username
        const input = credentials.email.trim().toLowerCase();
        const user = await User.findOne({
          $or: [{ email: input }, { username: input }],
        });

        if (!user || !user.password) {
          throw new Error("Invalid email/username or password.");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email/username or password.");
        }

        if (!user.emailVerified) {
          throw new Error(
            "Please verify your email address before logging in.",
          );
        }

        return { id: user._id.toString(), email: user.email };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        await connectDB();

        let user = await User.findOne({ email: profile.email });
        if (!user) {
          user = await User.create({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            isAdmin: false,
            emailVerified: new Date(),
          });
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      await connectDB();
      if (user) {
        const dbUser = await User.findById(user.id);
        token.id = dbUser._id.toString();
        token.email = dbUser.email;
        token.isAdmin = dbUser.isAdmin;
        token.name = dbUser.name;
        token.username = dbUser.username || "";
        token.image = dbUser.image || "";
        token.emailVerified = dbUser.emailVerified ? true : false;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        username: token.username,
        isAdmin: token.isAdmin,
        image: token.image,
        emailVerified: token.emailVerified,
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
