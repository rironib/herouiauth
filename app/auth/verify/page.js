import { Suspense } from "react";
import VerifyClient from "./VerifyClient";
import Loading from "@/components/Loading";
import { siteConfig } from "@/config/site";
import { generatePageMetadata } from "@/lib/generateMeta";

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
      <VerifyClient />
    </Suspense>
  );
}
