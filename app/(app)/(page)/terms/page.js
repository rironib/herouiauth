import { siteConfig } from "@/config/site";
import { generatePageMetadata } from "@/lib/generateMeta";

export const generateMetadata = async () => {
  const { tos: metadata } = siteConfig;
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

const TermsAndConditions = () => {
  return (
    <div>
      <div className="mb-6 text-center text-2xl font-bold md:text-3xl xl:text-4xl">
        Terms & Conditions
      </div>
      <div className="space-y-4 *:text-justify">
        <p>This is Terms & Conditions page.</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
