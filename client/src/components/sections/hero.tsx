import { useContent } from "@/lib/content-context";
import { Button } from "@/components/ui/button";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import demoScreenshot from "@assets/Screenshot_2026-01-18_at_22.52.49_1768769601506.png";

function isObjectStorageUrl(src: string): boolean {
  return src.startsWith("/objects/") || src.startsWith("/api/objects/");
}

export function Hero() {
  const { content } = useContent();

  const heroImage = content.hero.backgroundImage || demoScreenshot;

  // Get Demo link from navigation
  const demoLink = content.navigation.links.find(link => link.label === "Demo");
  const demoHref = demoLink?.href || "#demo";

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28 lg:py-32 flex items-center">
      <div className="container relative z-10 max-w-7xl px-4 md:px-6 mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div 
            className="flex flex-col justify-center space-y-8 text-center lg:text-left animate-fade-in-up"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl xl:text-7xl/none font-heading">
                {content.hero.headline}
              </h1>
              <p className="mx-auto max-w-[600px] text-lg text-muted-foreground md:text-xl lg:mx-0 font-sans font-light leading-relaxed">
                {content.hero.subhead}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
              <Button size="lg" className="h-12 px-8 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all bg-primary" asChild>
                <a href={content.hero.cta.href}>
                  {content.hero.cta.text}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg font-bold" asChild>
                <a href={demoHref}>
                  View Demo
                </a>
              </Button>
            </div>
          </div>
          
          <div 
            className="relative lg:ml-auto animate-fade-in-scale"
            style={{ animationDelay: "0.2s" }}
          >
             <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-gradient-to-b from-white to-slate-50">
                <div className="h-[400px] md:h-[480px] overflow-hidden">
                  {isObjectStorageUrl(heroImage) ? (
                    <ResponsiveImage 
                      src={heroImage} 
                      alt="Make-frame Demo - Photo Frame Generator Interface" 
                      className="w-full h-auto object-cover object-top"
                      mobileWidth={600}
                      desktopWidth={700}
                      sizes="(max-width: 768px) 100vw, 676px"
                      loading="eager"
                      fetchPriority="high"
                      width={676}
                      height={535}
                    />
                  ) : (
                    <img 
                      src={heroImage} 
                      alt="Make-frame Demo - Photo Frame Generator Interface" 
                      className="w-full h-auto object-cover object-top"
                      width={700}
                      height={480}
                    />
                  )}
                </div>
                {/* Fade overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
             </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 h-full w-1/2 bg-gradient-to-l from-indigo-50/50 to-transparent blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 -z-10 h-1/2 w-1/2 bg-gradient-to-tr from-blue-50/50 to-transparent blur-3xl opacity-60" />
    </section>
  );
}
