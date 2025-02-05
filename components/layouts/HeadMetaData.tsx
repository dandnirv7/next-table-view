import React from "react";
import Head from "next/head";

export const HeadMetaData: React.FC<{
  title?: string;
  metaDescription?: string;
  // ogImageUrl?: string;
  pathname?: string;
}> = ({
  title = "Table",
  metaDescription = "shadcn table with server side sorting, pagination, and filtering",
  // ogImageUrl = env.NEXT_PUBLIC_OG_IMAGE_URL,
  pathname = "",
}) => {
  const defaultTitle = "Table";

  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.BASE_URL_DEV
      : process.env.BASE_URL_PROD;

  const pageUrl = new URL(pathname, baseUrl).toString();

  return (
    <Head>
      <title>{title + " | " + defaultTitle}</title>
      <link rel="icon" href="/favicon.ico" />

      {/* metadata */}
      <meta name="title" content={title + " | " + defaultTitle} />
      <meta name="description" content={metaDescription} />
      {/* <meta name="og:image" itemProp="image" content={ogImageUrl} /> */}
      <meta property="og:url" content={pageUrl} />

      <meta property="og:type" content="website" />
      {/* <meta property="og:image" itemProp="image" content={ogImageUrl} /> */}
      <meta property="og:title" content={title + " | " + defaultTitle} />
      <meta property="og:description" content={metaDescription} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={title + " | " + defaultTitle} />
      {/* <meta name="twitter:image" content={ogImageUrl} /> */}
      <meta property="twitter:description" content={metaDescription} />
    </Head>
  );
};
