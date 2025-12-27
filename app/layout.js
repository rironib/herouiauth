import "./globals.css";
import { Providers } from "./providers";
import Analytics from "../components/Analytics";
import { hind_siliguri } from "@/lib/fonts";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { siteConfig } from "@/config/site";

export const generateMetadata = async () => {
  return {
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    robots: siteConfig.robots,
    alternates: {
      canonical: siteConfig.baseUrl,
    },
  };
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <Analytics />
      </head>
      <body className={`${hind_siliguri.className}`}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="flex min-h-screen flex-col justify-between">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
