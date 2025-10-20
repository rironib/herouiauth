import { siteConfig } from "@/config/site";
import { generatePageMetadata } from "@/lib/generateMeta";
import ContactForm from "@/app/(app)/(page)/contact/ContactPage";

export const generateMetadata = async () => {
  const { contact: metadata } = siteConfig;
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

export default function Page() {
  return <ContactForm />;
}
