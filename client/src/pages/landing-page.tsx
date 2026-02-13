import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useEffect, useRef } from "react";

export default function LandingPageView() {
  const params = useParams<{ slug: string }>();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { data: page, isLoading, error } = useQuery({
    queryKey: ["/api/landing-pages", params.slug],
    queryFn: async () => {
      const res = await fetch(`/api/landing-pages/${params.slug}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Page not found");
        throw new Error("Failed to load page");
      }
      return res.json();
    },
  });

  useEffect(() => {
    if (page?.htmlContent && iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(page.htmlContent);
        doc.close();
      }
    }
  }, [page?.htmlContent]);

  useEffect(() => {
    if (page) {
      document.title = page.metaTitle || page.title || "Make-frame";
    }
  }, [page]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground">The page you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      title={page.title}
      className="w-full min-h-screen border-0"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      style={{ display: "block" }}
      data-testid="landing-page-iframe"
    />
  );
}
