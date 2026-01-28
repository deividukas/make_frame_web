import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MessageCircle from "lucide-react/dist/esm/icons/message-circle";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right";
import { useEffect, useMemo } from "react";
import type { FaqItem } from "@shared/schema";

function FaqJsonLd({ faqItems }: { faqItems: FaqItem[] }) {
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }), [faqItems]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function FAQ() {
  const { data: faqItems = [], isLoading } = useQuery<FaqItem[]>({
    queryKey: ["faq"],
    queryFn: async () => {
      const res = await fetch("/api/faq");
      if (!res.ok) throw new Error("Failed to fetch FAQ");
      return res.json();
    },
  });

  useEffect(() => {
    document.title = "FAQ - Make-frame.com";
    
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

    const description = "Find answers to frequently asked questions about Make-frame.com - the photo frame generator for event organizers and marketing agencies.";
    updateMeta("description", description);
    updateMeta("og:title", "FAQ - Make-frame.com");
    updateMeta("og:description", description);
    updateMeta("og:type", "website");
    updateMeta("og:url", window.location.href);
  }, []);

  const categorizedFaq = useMemo(() => {
    const grouped: Record<string, FaqItem[]> = {};
    faqItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [faqItems]);

  const categories = Object.keys(categorizedFaq);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {faqItems.length > 0 && <FaqJsonLd faqItems={faqItems} />}
      <Navbar />
      
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about Make-frame.com and how it can help your events succeed.
              </p>
            </header>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-pulse text-muted-foreground">Loading FAQ...</div>
              </div>
            ) : faqItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No FAQ items available yet.
              </div>
            ) : (
              <div className="space-y-10">
                {categories.map((category) => (
                  <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')}>
                    <h2 className="text-2xl font-bold text-foreground mb-6 font-heading border-l-4 border-primary pl-4">
                      {category}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-3">
                      {categorizedFaq[category].map((item) => (
                        <AccordionItem
                          key={item.id}
                          value={`faq-${item.id}`}
                          className="border rounded-lg px-6 bg-card shadow-sm hover:shadow-md transition-shadow"
                          data-testid={`faq-item-${item.id}`}
                        >
                          <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-4" data-testid={`faq-trigger-${item.id}`}>
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pb-4 leading-relaxed prose prose-sm max-w-none" data-testid={`faq-content-${item.id}`}>
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </section>
                ))}
              </div>
            )}

            <section className="mt-16 text-center py-12 px-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-3 font-heading">
                Still have questions?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Can't find the answer you're looking for? Our team is here to help.
              </p>
              <Button asChild size="lg" className="gap-2" data-testid="contact-cta-button">
                <a href="https://make-frame.com/contacts">
                  Contact Us
                  <ChevronRight className="h-4 w-4" />
                </a>
              </Button>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
