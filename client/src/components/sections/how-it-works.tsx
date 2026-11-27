import { useContent } from "@/lib/use-content";
import { Upload, Share2, TrendingUp } from "lucide-react";

const icons = [Upload, Share2, TrendingUp];

export function HowItWorks() {
  const { content } = useContent();

  return (
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
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent z-0" />

          {content.howItWorks.map((step, index) => {
            const Icon = icons[index];
            return (
              <div 
                key={index}
                className="relative z-10 flex flex-col items-center text-center space-y-4 p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-lg shadow-indigo-500/5 border border-indigo-100 text-primary mb-4 transition-transform hover:scale-105 duration-300">
                  <Icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
