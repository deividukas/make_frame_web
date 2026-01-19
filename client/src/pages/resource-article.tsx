import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import { format } from "date-fns";
import { useEffect } from "react";
import type { Resource } from "@shared/schema";

export default function ResourceArticle() {
  const { slug } = useParams<{ slug: string }>();

  const { data: resource, isLoading, error } = useQuery<Resource>({
    queryKey: ["resource", slug],
    queryFn: async () => {
      const res = await fetch(`/api/resources/${slug}`);
      if (!res.ok) throw new Error("Resource not found");
      return res.json();
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (resource) {
      document.title = resource.metaTitle || resource.title;
      
      const updateMeta = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`) ||
                   document.querySelector(`meta[property="${name}"]`);
        if (meta) {
          meta.setAttribute("content", content);
        } else {
          meta = document.createElement("meta");
          meta.setAttribute(name.startsWith("og:") ? "property" : "name", name);
          meta.setAttribute("content", content);
          document.head.appendChild(meta);
        }
      };

      const description = resource.metaDescription || resource.excerpt || "";
      updateMeta("description", description);
      updateMeta("og:title", resource.metaTitle || resource.title);
      updateMeta("og:description", description);
      updateMeta("og:type", "article");
      updateMeta("og:url", window.location.href);
      if (resource.featuredImage) {
        updateMeta("og:image", resource.featuredImage);
      }
      updateMeta("twitter:card", "summary_large_image");
      updateMeta("twitter:title", resource.metaTitle || resource.title);
      updateMeta("twitter:description", description);
      if (resource.featuredImage) {
        updateMeta("twitter:image", resource.featuredImage);
      }

      const existingSchema = document.querySelector('script[type="application/ld+json"][data-resource]');
      if (existingSchema) {
        existingSchema.remove();
      }
      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: resource.title,
        description: description,
        image: resource.featuredImage || undefined,
        datePublished: resource.publishedAt,
        dateModified: resource.updatedAt,
        author: {
          "@type": "Organization",
          name: "Make-frame",
          url: "https://make-frame.com"
        },
        publisher: {
          "@type": "Organization",
          name: "Make-frame",
          url: "https://make-frame.com"
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": window.location.href
        }
      };
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-resource", "true");
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);

      return () => {
        const schemaToRemove = document.querySelector('script[type="application/ld+json"][data-resource]');
        if (schemaToRemove) {
          schemaToRemove.remove();
        }
      };
    }
  }, [resource]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resource?.title,
          text: resource?.excerpt || "",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article not found</h1>
            <Link href="/resources">
              <Button>Back to articles</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontSize: '16px' }}>
      <Navbar />
      <main className="flex-1">
        <article className="py-12 md:py-16">
          <div className="container max-w-4xl px-4 md:px-6 mx-auto">
            <div className="mb-8">
              <Link href="/resources">
                <Button variant="ghost" className="gap-2 mb-6">
                  <ArrowLeft className="h-4 w-4" />
                  All articles
                </Button>
              </Link>

              <header>
                <h1 className="text-[32px] md:text-[36px] lg:text-[40px] font-bold tracking-tight mb-4 leading-tight">
                  {resource.title}
                </h1>
                
                <div className="flex items-center justify-between flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {resource.publishedAt && (
                      <time dateTime={new Date(resource.publishedAt).toISOString()}>
                        {format(new Date(resource.publishedAt), "MMMM d, yyyy")}
                      </time>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </header>
            </div>

            {resource.featuredImage && (
              <figure className="mb-8">
                <img
                  src={resource.featuredImage}
                  alt={resource.featuredImageAlt || resource.title}
                  className="w-full rounded-lg shadow-lg"
                />
              </figure>
            )}

            {resource.keyTakeaways && (
              <section id="key-takeaways" className="mb-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-primary">Key Takeaways</h2>
                <div 
                  className="prose prose-sm max-w-none"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {resource.keyTakeaways}
                </div>
              </section>
            )}

            <div 
              className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg prose-p:text-base prose-p:leading-relaxed prose-li:text-base prose-strong:font-semibold"
              style={{ fontSize: '16px', lineHeight: '1.75' }}
              dangerouslySetInnerHTML={{ __html: resource.content }}
            />

            <div className="mt-12 pt-8 border-t">
              <Link href="/resources">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to articles
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
