import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  noindex?: boolean;
}

export default function SEO({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  canonical,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    // Actualizar título
    if (title) {
      document.title = title;
    }

    const updateMetaTag = (
      name: string,
      content: string,
      isProperty = false
    ) => {
      const attribute = isProperty ? "property" : "name";
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", content);
    };

    // Actualizar meta description
    if (description) {
      updateMetaTag("description", description);
    }

    // Actualizar keywords
    if (keywords) {
      updateMetaTag("keywords", keywords);
    }

    // Open Graph tags
    if (ogTitle || title) {
      updateMetaTag("og:title", ogTitle || title || "", true);
    }
    if (ogDescription || description) {
      updateMetaTag("og:description", ogDescription || description || "", true);
    }
    if (ogImage) {
      updateMetaTag("og:image", ogImage, true);
    }
    if (ogUrl) {
      updateMetaTag("og:url", ogUrl, true);
    }
    updateMetaTag("og:type", "website", true);

    // Twitter Card tags
    if (ogTitle || title) {
      updateMetaTag("twitter:title", ogTitle || title || "");
    }
    if (ogDescription || description) {
      updateMetaTag("twitter:description", ogDescription || description || "");
    }
    if (ogImage) {
      updateMetaTag("twitter:image", ogImage);
    }
    updateMetaTag("twitter:card", "summary_large_image");

    // Canonical URL
    if (canonical) {
      let link = document.querySelector(
        "link[rel='canonical']"
      ) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    // Robots meta tag
    if (noindex) {
      updateMetaTag("robots", "noindex, nofollow");
    } else {
      updateMetaTag("robots", "index, follow");
    }
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    canonical,
    noindex,
  ]);

  return null;
}
