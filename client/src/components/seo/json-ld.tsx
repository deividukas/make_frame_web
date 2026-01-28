import { useEffect } from "react";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [data]);

  return null;
}

export function SoftwareApplicationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Make-frame",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "description": "Photo frame generator for event organizers. Create branded photo frames that attendees can use to generate and share professional photos on social media.",
    "url": "https://make-frame.com",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free trial available with 5 frames per day"
    },
    "featureList": [
      "Branded photo frame templates",
      "Easy attendee photo uploads",
      "Social media optimized output",
      "Real-time preview",
      "Event branding customization",
      "Iframe integration"
    ],
    "screenshot": "https://make-frame.com/og-image.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return <JsonLd data={data} />;
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Make-Frame",
    "url": "https://make-frame.com",
    "logo": "https://make-frame.com/logo.png",
    "description": "The easiest way for event organizers to turn attendee selfies into branded, shareable social posts. Boost engagement for conferences, exhibitions, concerts, and movements.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://make-frame.com/contacts"
    },
    "sameAs": [
      "https://twitter.com/makeframe",
      "https://linkedin.com/company/makeframe"
    ]
  };

  return <JsonLd data={data} />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Make-frame",
    "url": "https://make-frame.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://make-frame.com/resources?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return <JsonLd data={data} />;
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  featuredImage?: string;
}

export function ArticleJsonLd({ 
  title, 
  description, 
  slug, 
  publishedAt, 
  updatedAt,
  featuredImage 
}: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": `https://make-frame.com/resources/${slug}`,
    "datePublished": publishedAt,
    "dateModified": updatedAt || publishedAt,
    "author": {
      "@type": "Organization",
      "name": "Make-frame"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Make-frame",
      "logo": {
        "@type": "ImageObject",
        "url": "https://make-frame.com/logo.png"
      }
    },
    ...(featuredImage && {
      "image": {
        "@type": "ImageObject",
        "url": featuredImage
      }
    })
  };

  return <JsonLd data={data} />;
}
