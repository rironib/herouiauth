import { siteConfig } from "@/config/site";
import { generatePageMetadata } from "@/lib/generateMeta";

export const generateMetadata = async () => {
  const { dashboard: metadata } = siteConfig;
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

const Page = () => {
  return (
    <div className="grow">
      <div className="my-4 text-center text-3xl">Dashboard</div>
    </div>
  );
};

export default Page;
