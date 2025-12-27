// app/api/auth/[...nextauth]/route.js

import connectDB from "@/lib/db";
import { checkRateLimit } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import User from "@/models/User";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "Captcha Token", type: "text" },
      },
      async authorize(credentials) {
        await connectDB();

        // Rate limiting: 5 attempts per email per minute
        const identifier = credentials.email?.trim().toLowerCase() || "unknown";
        const rateLimitCheck = checkRateLimit(identifier, 5, 60000);
        if (!rateLimitCheck.success) {
          throw new Error(rateLimitCheck.error);
        }

        // ✅ Validate captcha
        const captcha = await verifyTurnstile(credentials.captchaToken);
        if (!captcha.success) {
          throw new Error(captcha.error || "Captcha verification failed.");
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("All fields are required.");
        }

        // Find user by email
        const input = credentials.email.trim().toLowerCase();
        const user = await User.findOne({ email: input });

        if (!user || !user.password) {
          throw new Error("Invalid email or password.");
        }

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password.");
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
