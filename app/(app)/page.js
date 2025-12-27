import Link from "next/link";
import { siteConfig } from "@/config/site";
import { RiGithubLine } from "react-icons/ri";
import { button as buttonStyles } from "@heroui/theme";
import { generatePageMetadata } from "@/lib/generateMeta";

export const generateMetadata = async () => {
  const { home: metadata } = siteConfig;
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

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
          The Ultimate&nbsp;
        </h1>
        <h1 className="text-primary text-4xl font-bold tracking-tight lg:text-6xl">
          Next.js Starter Kit
        </h1>
        <div className="mt-4 text-lg text-default-600 lg:text-xl">
          Secure Authentication, Modern UI, and Production-Ready Architecture.
          Built with Next.js 15, HeroUI, NextAuth, and MongoDB.
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/docs"
        >
          Documentation
        </Link>
        <Link
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href="https://github.com/rironib/herouiauth"
          target="_blank"
          rel="noreferrer"
        >
          <RiGithubLine size={20} />
          GitHub
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {["Next.js 15", "HeroUI", "TailwindCSS 4", "NextAuth", "MongoDB"].map(
          (tech) => (
            <div
              key={tech}
              className="rounded-full border border-default-200 bg-default-50 px-4 py-1 text-sm font-medium text-default-600"
            >
              {tech}
            </div>
          ),
        )}
      </div>
    </section>
  );
}
