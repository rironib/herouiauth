import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const Analytics = () => {
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
                gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
};
export default Analytics;
