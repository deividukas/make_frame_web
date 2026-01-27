import { useContent } from "@/lib/content-context";
import { Upload, Share2, TrendingUp } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";

const icons = [Upload, Share2, TrendingUp];

export function HowItWorks() {
  const { content } = useContent();

  return (
    <LazyMotion features={domAnimation} strict>
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Three steps to viral growth
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
              Streamlined for speed and simplicity.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent z-0" />

            {content.howItWorks.map((step, index) => {
              const Icon = icons[index];
              return (
                <m.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative z-10 flex flex-col items-center text-center p-6 rounded-xl bg-white border border-slate-100 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </m.div>
              );
            })}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
