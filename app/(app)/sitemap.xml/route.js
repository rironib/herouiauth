export const revalidate = 60;

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const allRoutes = [
    { url: `${baseUrl}/`, lastmod: "2025-04-15T18:28:45.137Z" },
    { url: `${baseUrl}/about`, lastmod: "2025-04-15T18:28:45.137Z" },
    { url: `${baseUrl}/contact`, lastmod: "2025-04-15T18:28:45.137Z" },
    { url: `${baseUrl}/privacy`, lastmod: "2025-04-15T18:28:45.137Z" },
    { url: `${baseUrl}/auth/login`, lastmod: "2025-04-15T18:28:45.137Z" },
    { url: `${baseUrl}/auth/register`, lastmod: "2025-04-15T18:28:45.137Z" },
    { url: `${baseUrl}/auth/reset`, lastmod: "2025-04-15T18:28:45.137Z" },
    { url: `${baseUrl}/auth/forgot`, lastmod: "2025-04-15T18:28:45.137Z" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    ({ url, lastmod }) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
