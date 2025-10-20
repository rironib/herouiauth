"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";

const Footer = () => {
  const { siteName, socialLinks } = siteConfig;
  return (
    <div className="space-y-6 px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
      <div className="flex items-center justify-center gap-6 text-xl font-bold">
        {socialLinks.map(({ url, icon: Icon }) => (
          <Link key={url} href={url}>
            <Icon />
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 gap-y-2">
        <Link href="/">Home</Link>
        <Link href="/about/">About</Link>
        <Link href="/contact/">Contact</Link>
        <Link href="/privacy/">Privacy Policy</Link>
        <Link href="/terms/">Terms & Conditions</Link>
        <Link href="/sitemap.xml">Sitemap</Link>
      </div>
      <div className="text-center">
        <h3>
          Copyright &copy; {new Date().getFullYear()}{" "}
          <strong>{siteName}</strong>. All Rights Reserved.
        </h3>
      </div>
    </div>
  );
};

export default Footer;
