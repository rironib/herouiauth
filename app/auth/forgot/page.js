// src/app/auth/forgot/page.js

import { Suspense } from "react";
import Loading from "@/components/Loading";
import ForgotForm from "@/app/auth/forgot/ForgotForm";
import { siteConfig } from "@/config/site";
import { generatePageMetadata } from "@/lib/generateMeta";

export const generateMetadata = async () => {
  const { forgot: metadata } = siteConfig;
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

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ForgotForm />
    </Suspense>
  );
}
