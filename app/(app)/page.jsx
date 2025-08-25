import { button as buttonStyles } from "@heroui/theme";
import { RiGithubLine } from "react-icons/ri";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export const generateMetadata = async () => {
  const { home: metadata } = siteConfig;
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

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl justify-center text-center">
        <span className="text-3xl lg:text-4xl">Make&nbsp;</span>
        <span className="text-3xl lg:text-4xl">beautiful&nbsp;</span>
        <br />
        <span className="text-3xl lg:text-4xl">
          websites regardless of your design experience.
        </span>
        <div className="text-lg lg:text-xl">
          Beautiful, fast and modern React UI library.
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="https://www.heroui.com/docs/guide/introduction"
        >
          Documentation
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href="https://github.com/rironib/herouiauth"
        >
          <RiGithubLine size={20} />
          GitHub
        </Link>
      </div>
      <div className="bg-default-50 mt-8 rounded-full border-2 border-blue-500 px-6 py-3">
        Get started by editing <span color="primary">app/page.jsx</span>
      </div>
    </section>
  );
}
