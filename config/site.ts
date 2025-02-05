export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next Table View",
  description: "",
  url:
    process.env.NODE_ENV === "development"
      ? process.env.BASE_URL_DEV
      : process.env.BASE_URL_PROD,
  links: { github: "https://github.com/dandnirv7/next-table-view" },
};
