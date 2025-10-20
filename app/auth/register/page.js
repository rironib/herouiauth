import { Suspense } from "react";
import Loading from "@/components/Loading";
import { siteConfig } from "@/config/site";
import SignupForm from "@/app/auth/register/SignupForm";
import { generatePageMetadata } from "@/lib/generateMeta";

export const generateMetadata = async () => {
  const { register: metadata } = siteConfig;
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignupForm />
    </Suspense>
  );
}
