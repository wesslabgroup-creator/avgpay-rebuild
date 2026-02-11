import { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
  };
}
