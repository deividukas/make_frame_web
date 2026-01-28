import { useContent } from "@/lib/content-context";
import Upload from "lucide-react/dist/esm/icons/upload";
import Share2 from "lucide-react/dist/esm/icons/share-2";
import TrendingUp from "lucide-react/dist/esm/icons/trending-up";
import { motion } from "framer-motion";

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
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent z-0" />

          {content.howItWorks.map((step, index) => {
            const Icon = icons[index];
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative z-10 flex flex-col items-center text-center space-y-4 p-6"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-lg shadow-indigo-500/5 border border-indigo-100 text-primary mb-4 transition-transform hover:scale-105 duration-300">
                  <Icon className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
