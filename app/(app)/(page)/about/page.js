import { siteConfig } from "@/config/site";
import { generatePageMetadata } from "@/lib/generateMeta";

export const generateMetadata = async () => {
  const { about: metadata } = siteConfig;
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

const AboutUs = () => {
  return (
    <div>
      <div className="space-y-6">
        <div className="mb-6 text-center text-2xl font-bold md:text-3xl xl:text-4xl">
          About Us
        </div>
        <div className="space-y-3 *:text-justify">
          <p>This is about page.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
