import { Suspense, lazy } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { useContent } from "@/lib/content-context";
import { SoftwareApplicationJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";

// Lazy load below-the-fold components
const UseCases = lazy(() => import("@/components/sections/use-cases").then(m => ({ default: m.UseCases })));
const Pricing = lazy(() => import("@/components/sections/pricing").then(m => ({ default: m.Pricing })));
const Footer = lazy(() => import("@/components/layout/footer").then(m => ({ default: m.Footer })));

function SectionFallback() {
  return <div className="py-24 animate-pulse bg-slate-50/50" />;
}

export default function Home() {
  const { content } = useContent();

  // Get Demo link from navigation
  const demoLink = content.navigation.links.find(link => link.label === "Demo");
  const demoHref = demoLink?.href || "#demo";

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <SoftwareApplicationJsonLd />
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        
        {/* Demo CTA Section */}
        <section id="demo" className="py-24 bg-primary text-primary-foreground relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          <div className="container relative z-10 text-center space-y-8 px-4 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="space-y-4 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Experience it like your attendees will</h2>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">
                  Don't just take our word for it. Try our live demo to see how seamless the photo experience is.
                </p>
              </div>
              <div className="flex justify-center">
                <a 
                  href={demoHref} 
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-lg font-medium text-primary shadow-xl hover:bg-slate-100 transition-colors"
                >
                  View Live Demo
                </a>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<SectionFallback />}>
          <UseCases />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <Pricing />
        </Suspense>
      </main>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
}
