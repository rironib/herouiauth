import { siteConfig } from "@/config/site";

export const generateMetadata = async () => {
  const { about: metadata } = siteConfig;
  const { title, description, link, keywords, robots } = metadata;
  return {
    title: title || siteConfig.title,
    description: description || siteConfig.description,
    keywords: keywords || siteConfig.keywords,
    robots: robots || siteConfig.robots,
    alternates: {
      canonical: `${siteConfig.baseUrl}${link ? link : ""}`,
    },
    openGraph: {
      title: title || siteConfig.title,
      description: description || siteConfig.description,

      url: `${siteConfig.baseUrl}${link ? link : ""}`,
      type: "website",
      site_name: siteConfig.siteName,
      locale: "en_US",
      images: [
        {
          url: siteConfig.socialCover,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      url: `${siteConfig.baseUrl}${link ? link : ""}`,
      title: title || siteConfig.title,
      description: description || siteConfig.description,
      images: [siteConfig.socialCover],
      site: `@${siteConfig.siteName}`,
      creator: `@${siteConfig.author}`,
    },
  };
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
