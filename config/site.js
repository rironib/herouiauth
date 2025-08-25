import { RiFacebookFill, RiTelegram2Line, RiYoutubeLine } from "react-icons/ri";

const homeURL = process.env.NEXT_PUBLIC_BASE_URL;
const siteName = process.env.NEXT_PUBLIC_SITENAME;

export const siteConfig = {
  name: siteName,
  siteName: siteName,
  title: siteName,
  description:
    "Boilerplate for Next.js 13, NextAuth, ShadcnUI, Tailwind CSS, React Hook Form, React Icons, and more.",
  keywords:
    "nextauth, shadcnui, react, next, react-hook-form, react-icons, tailwindcss",
  baseUrl: homeURL,
  author: "rironib",
  robots: "index, follow",
  icon: homeURL + "/favicon.ico",
  fallback: homeURL + "/images/error.png",
  socialCover: homeURL + "/images/social_cover.png",
  socialLinks: [
    { url: "https://web.facebook.com/rironib", icon: RiFacebookFill },
    { url: "https://t.me/rironib", icon: RiTelegram2Line },
    { url: "https://www.youtube.com/@TrickBuzzYT", icon: RiYoutubeLine },
  ],
  // Home
  home: {
    title: siteName,
    description:
      "Boilerplate for Next.js 13, NextAuth, ShadcnUI, Tailwind CSS, React Hook Form, React Icons, and more.",
    keywords:
      "nextauth, shadcnui, react, next, react-hook-form, react-icons, tailwindcss",
  },
  // Error
  error: {
    title: "Page Not Found",
    description:
      "Boilerplate for Next.js 13, NextAuth, ShadcnUI, Tailwind CSS, React Hook Form, React Icons, and more.",
    keywords:
      "nextauth, shadcnui, react, next, react-hook-form, react-icons, tailwindcss",
    robots: "noindex, nofollow",
  },
  // Login
  login: {
    title: "Login",
    description: "Login to your account to continue.",
    link: "/auth/login",
  },
  // Register
  register: {
    title: "Sign up",
    description: "Create an account to continue.",
    link: "/auth/register",
  },
  // Forgot Password
  forgot: {
    title: "Forgot Password",
    description:
      "Forgot your password? No problem. Just let us know your email address and we will email you a link to reset your password.",
    link: "/auth/forgot",
  },
  // Reset Password
  reset: {
    title: "Reset Password",
    description: "Reset your password to continue.",
    link: "/auth/reset",
  },
  // Verify Email
  verify: {
    title: "User verification",
    description: "Verify yourself address to continue.",
    link: "/auth/verify",
  },
  // Admin
  admin: {
    title: "Admin Panel",
    description: "Access the admin panel to manage the site.",
    link: "/admin",
  },
  // Dashboard
  dashboard: {
    title: "Dashboard",
    description: "Your personal dashboard to manage your account and settings.",
    link: "/dashboard",
  },
  //   MISC PAGES
  // About us
  about: {
    title: "About Us",
    description:
      "Discover the story behind TrickBuzz, our mission, vision, and the team dedicated to delivering the latest tech news, tips, and resources to our community.",
    link: "/about",
  },
  // About us
  contact: {
    title: "Contact Us",
    description:
      "Get in touch with the TrickBuzz team. Reach out for support, feedback, business inquiries, or any questions you may have about our website and services.",
    link: "/contact",
  },
  // Terms of Service
  tos: {
    title: "Terms of Service",
    description:
      "Read the comprehensive Terms & Services for using TrickBuzz. Understand your rights, responsibilities, and the legal framework that governs your access to our technology news, articles, and resources.",
    link: "/tos",
  },
  // Privacy Policy
  privacy: {
    title: "Privacy Policy",
    description:
      "Read our Privacy Policy to understand how TrickBuzz collects, uses, and protects your personal information when you use our website and services.",
    link: "/privacy",
  },
};
