import Link from "next/link";
import { siteConfig } from "@/config/site";

export const generateMetadata = async () => {
  const { error: metadata } = siteConfig;
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

export default function Error() {
  return (
    <div className="flex min-h-[50dvh] flex-col items-center justify-center">
      <h1 className="text-center text-4xl font-bold text-red-500">
        Something went wrong!
      </h1>
      <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
        An error occurred. Please refresh the page or try again later.
      </p>

      <Link href="/" className="mt-6 rounded bg-blue-500 px-4 py-2 text-white">
        Go to Homepage
      </Link>
    </div>
  );
}
