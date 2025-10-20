// src/app/auth/login/page.js

import { Suspense } from "react";
import LoginForm from "./LoginForm";
import Loading from "@/components/Loading";
import { siteConfig } from "@/config/site";
import { generatePageMetadata } from "@/lib/generateMeta";

export const generateMetadata = async () => {
  const { login: metadata } = siteConfig;
  const { title, description, link, keywords, robots } = metadata;
  return generatePageMetadata({
    title: title,
    description: description,
    image: "",
    slug: link,
    keywords: keywords,
    robots: robots,
  });
};

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}
