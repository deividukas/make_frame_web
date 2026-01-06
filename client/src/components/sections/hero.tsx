import { useContent } from "@/lib/content-context";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroImage from "@assets/generated_images/minimalist_tech_abstract_background_with_indigo_gradients.png";

export function Hero() {
  const { content } = useContent();

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28 lg:py-32 flex items-center">
      <div className="container relative z-10 max-w-7xl px-4 md:px-6 mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-8 text-center lg:text-left"
          >
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl xl:text-7xl/none font-sans">
                {content.hero.headline}
              </h1>
              <p className="mx-auto max-w-[600px] text-lg text-muted-foreground md:text-xl lg:mx-0 font-light leading-relaxed">
                {content.hero.subhead}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
              <Button size="lg" className="h-12 px-8 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all" asChild>
                <a href={content.hero.cta.href}>
                  {content.hero.cta.text}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
                <a href="#demo">
                  View Demo
                </a>
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:ml-auto"
          >
             <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-white/50 backdrop-blur-sm p-2">
                <img 
                  src={heroImage} 
                  alt="Abstract Tech Background" 
                  className="rounded-xl w-full h-auto object-cover aspect-[4/3]"
                />
                {/* Overlay UI Mockup Element */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur rounded-lg p-6 shadow-lg border border-border/40 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-primary font-bold text-xl">
                      SF
                    </div>
                    <div>
                      <div className="h-2 w-32 bg-slate-200 rounded mb-2"></div>
                      <div className="h-2 w-20 bg-slate-100 rounded"></div>
                    </div>
                    <div className="ml-auto">
                      <div className="h-8 w-24 bg-primary/10 rounded-md text-primary flex items-center justify-center text-xs font-medium">
                        Uploaded
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 h-full w-1/2 bg-gradient-to-l from-indigo-50/50 to-transparent blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 -z-10 h-1/2 w-1/2 bg-gradient-to-tr from-blue-50/50 to-transparent blur-3xl opacity-60" />
    </section>
  );
}
