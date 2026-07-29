import React, { useEffect } from "react";

export default function SEO({ 
  title = "The Rolling Dough | Premium Live Neapolitan Pizza Catering", 
  description = "Authentic live wood-fired Neapolitan pizza catering for weddings, corporate galas, and private celebrations across Ahmedabad, Vadodara, Nadiad, and Anand.",
  canonical = "https://therollingdough.in",
  ogImage = "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1200&q=80"
}) {
  useEffect(() => {
    // Dynamic Document Title
    document.title = title;

    // Meta Tag Helpers
    const setMeta = (name, content, attrName = "name") => {
      let element = document.querySelector(`meta[${attrName}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", canonical, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    // Canonical link tag
    let linkCanonical = document.querySelector("link[rel='canonical']");
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", canonical);

    // Schema.org Structured Data (JSON-LD)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FoodEstablishment",
      "name": "The Rolling Dough",
      "image": ogImage,
      "@id": "https://therollingdough.in",
      "url": "https://therollingdough.in",
      "telephone": "+919898112345",
      "priceRange": "₹₹₹",
      "servesCuisine": "Neapolitan Italian Pizza",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Off S.G. Highway, Bodakdev",
        "addressLocality": "Ahmedabad",
        "addressRegion": "Gujarat",
        "postalCode": "380054",
        "addressCountry": "IN"
      },
      "areaServed": ["Ahmedabad", "Vadodara", "Nadiad", "Anand"],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "11:00",
          "closes": "23:30"
        }
      ]
    };

    let scriptSchema = document.querySelector("#schema-jsonld");
    if (!scriptSchema) {
      scriptSchema = document.createElement("script");
      scriptSchema.id = "schema-jsonld";
      scriptSchema.type = "application/ld+json";
      document.head.appendChild(scriptSchema);
    }
    scriptSchema.text = JSON.stringify(schemaData);

  }, [title, description, canonical, ogImage]);

  return null;
}
