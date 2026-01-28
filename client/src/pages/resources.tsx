import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import { format } from "date-fns";
import { useContent } from "@/lib/content-context";
import type { Resource } from "@shared/schema";

export default function Resources() {
  const { content } = useContent();
  
  const { data: resources = [], isLoading } = useQuery<Resource[]>({
    queryKey: ["resources"],
    queryFn: async () => {
      const res = await fetch("/api/resources");
      if (!res.ok) throw new Error("Failed to fetch resources");
      return res.json();
    },
  });

  const headline = content.resourcesPage?.headline || "News & Tips";
  const subhead = content.resourcesPage?.subhead || "Learn more about event photography, social media marketing, and Make-frame capabilities.";

  return (
    <div className="min-h-screen flex flex-col" style={{ fontSize: '16px' }}>
      <Navbar />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-b from-purple-50 to-white">
          <div className="container max-w-7xl px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-4 leading-tight">
                {headline}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {subhead}
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading...
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles available at this time.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.map((resource) => (
                  <Link key={resource.id} href={`/resources/${resource.slug}`}>
                    <Card 
                      className="h-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                      data-testid={`card-resource-${resource.id}`}
                    >
                      {resource.featuredImage && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={resource.featuredImage}
                            alt={resource.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Calendar className="h-4 w-4" />
                          {resource.publishedAt && (
                            <time dateTime={new Date(resource.publishedAt).toISOString()}>
                              {format(new Date(resource.publishedAt), "MMMM d, yyyy")}
                            </time>
                          )}
                        </div>
                        <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors leading-snug">
                          {resource.title}
                        </h2>
                        {resource.excerpt && (
                          <p className="text-muted-foreground line-clamp-3 mb-4 text-base leading-relaxed">
                            {resource.excerpt}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm">
                          Read more
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
