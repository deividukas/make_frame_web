import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { UseCases } from "@/components/sections/use-cases";
import { Pricing } from "@/components/sections/pricing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
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
                  href="#" 
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-lg font-medium text-primary shadow-xl hover:bg-slate-100 transition-colors"
                >
                  View Live Demo
                </a>
              </div>
            </div>
          </div>
        </section>

        <UseCases />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
