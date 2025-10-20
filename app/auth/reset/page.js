import { Suspense } from "react";
import ResetClient from "./ResetClient";
import Loading from "@/components/Loading";
import { siteConfig } from "@/config/site";
import { generatePageMetadata } from "@/lib/generateMeta";

export const generateMetadata = async () => {
  const { reset: metadata } = siteConfig;
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetClient />
    </Suspense>
  );
}
