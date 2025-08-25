import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise, { getDb } from "@/lib/mongodb";
import { compare } from "bcrypt";
import { ObjectId } from "mongodb";
import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { NextResponse } from "next/server";

const dbName = process.env.DB_NAME;

const authOptions = {
  adapter: MongoDBAdapter(clientPromise, { databaseName: dbName }),
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
        // ✅ Validate captcha using our helper
        const captcha = await verifyTurnstile(credentials.captchaToken);
        if (!captcha.success) {
          return NextResponse.json({ error: captcha.error }, { status: 403 });
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("All fields are required.");
        }

        // Find user by email or username
        const input = credentials.email.trim().toLowerCase();
        const db = await getDb();
        const user = await db.collection("users").findOne({
          $or: [{ email: input }, { username: input }],
        });

        if (!user || !user.password) {
          throw new Error("Invalid email/username or password.");
        }

        // Compare password
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email/username or password.");
        }

        // Require verified email
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
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // Runs on initial sign-in + every token refresh
    async jwt({ token, user }) {
      const db = await getDb();

      // On first login, merge DB user data into token
      if (user) {
        let dbUser = null;

        // Try to fetch by ObjectId if valid
        if (user.id && ObjectId.isValid(user.id)) {
          dbUser = await db
            .collection("users")
            .findOne({ _id: new ObjectId(user.id) });
        }

        // Store data in token
        token.id = dbUser._id.toString();
        token.email = dbUser.email;
        token.isAdmin = dbUser.isAdmin || false;
        token.name = dbUser.name || "";
        token.username = dbUser.username || "";
        token.image = dbUser.image || "";
        token.emailVerified = dbUser.emailVerified || false;
      }
      return token;
    },

    // Sends token data to the client session
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
