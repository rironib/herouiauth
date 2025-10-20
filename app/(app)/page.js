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
