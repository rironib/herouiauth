import { siteConfig } from "@/config/site";

export function generatePageMetadata({
  title,
  description,
  image,
  keywords,
  slug,
  robots,
}) {
  const pageTitle = title ? `${title} - ${siteConfig.title}` : siteConfig.title;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.socialCover;
  const pageUrl = slug ? `${siteConfig.baseUrl}${slug}` : siteConfig.baseUrl;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords || siteConfig.keywords,
    robots: robots || siteConfig.robots,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      type: "article",
      site_name: siteConfig.siteName,
      locale: siteConfig.locale,
      images: [{ url: pageImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      site: `@${siteConfig.siteName}`,
      creator: `@${siteConfig.author}`,
    },
  };
}
