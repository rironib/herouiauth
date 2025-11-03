import { Suspense } from "react";
import Loading from "@/components/Loading";
import { siteConfig } from "@/config/site";
import { generatePageMetadata } from "@/lib/generateMeta";
import VerifyForm from "@/app/auth/verify/VerifyForm";

export const generateMetadata = async () => {
  const { verify: metadata } = siteConfig;
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

export default function VerifyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyForm />
    </Suspense>
  );
}
