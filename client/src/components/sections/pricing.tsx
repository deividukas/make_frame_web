import { useContent } from "@/lib/content-context";
import { useState } from "react";
import Check from "lucide-react/dist/esm/icons/check";
import Info from "lucide-react/dist/esm/icons/info";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Pricing() {
  const { content } = useContent();
  const [isAnnual, setIsAnnual] = useState(true);

  const premium = content.pricing.premium;
  const hasAnnual = !!(premium.annualPrice && premium.annualTotal);

  return (
    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Simple, Scalable Pricing
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground text-lg">
            Pay only for the volume you need. No hidden fees.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-4xl mx-auto mb-20">
          {/* Free Tier */}
          <Card className="flex flex-col border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">{content.pricing.free.title}</CardTitle>
              <CardDescription>{content.pricing.free.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-4xl font-bold mb-6">{content.pricing.free.price} <span className="text-lg font-normal text-muted-foreground">/ mo</span></div>
              <ul className="space-y-3">
                {content.pricing.free.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full h-11 text-base" asChild>
                <a href={content.hero.cta.href}>Start Free</a>
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Tier */}
          <Card className="flex flex-col border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden bg-white group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7c3aed] via-[#db2777] to-[#7c3aed]" />
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                 <CardTitle className="text-2xl text-primary font-heading font-bold">{premium.title}</CardTitle>
                 <span className="px-3 py-1 bg-gradient-to-r from-[#7c3aed] to-[#db2777] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">Best Value</span>
              </div>
              <CardDescription className="font-sans">{premium.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {hasAnnual && (
                <div className="flex items-center gap-3 mb-5">
                  <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isAnnual}
                    aria-label="Toggle annual pricing"
                    onClick={() => setIsAnnual(!isAnnual)}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isAnnual ? 'bg-primary' : 'bg-slate-200'}`}
                    data-testid="toggle-annual-pricing"
                  >
                    <span
                      className={`pointer-events-none block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition-transform ${isAnnual ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                  <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Annual</span>
                  {premium.savingsPercent && isAnnual && (
                    <span className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full" data-testid="text-savings-badge">
                      Save {premium.savingsPercent}%
                    </span>
                  )}
                </div>
              )}

              <div className="mb-6">
                <div className="text-4xl font-bold font-heading">
                  {isAnnual && hasAnnual ? premium.annualPrice : premium.price}
                  <span className="text-lg font-normal text-muted-foreground font-sans"> /month</span>
                </div>
                {isAnnual && hasAnnual && (
                  <div className="mt-1 text-sm">
                    <span className="text-muted-foreground line-through mr-2">{premium.annualOriginalTotal}</span>
                    <span className="text-primary font-semibold">{premium.annualTotal}/year</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3">
                {premium.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-medium text-slate-700 font-sans">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 bg-gradient-to-r from-[#7c3aed] to-[#db2777] hover:opacity-90 transition-opacity border-none" asChild>
                <a href={content.hero.cta.href}>Upgrade to Premium</a>
              </Button>
              <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-widest">Powered by Stripe</p>
            </CardFooter>
          </Card>
        </div>

        {/* Addons */}
        <div className="max-w-4xl mx-auto mb-20">
          <h3 className="text-xl font-bold mb-8 text-center">Need More Power? (Extra Frame Packages)</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {content.pricing.addOns.map((addon: { size: string; count: string; price: string; perFrame: string }, i: number) => (
              <div key={i} className="rounded-xl border bg-white p-6 shadow-sm flex flex-col items-center text-center">
                <div className="font-medium text-muted-foreground mb-2">{addon.size}</div>
                <div className="text-2xl font-bold mb-1">{addon.count}</div>
                <div className="text-xl font-bold text-primary mb-2">{addon.price}</div>
                <div className="text-sm text-muted-foreground">{addon.perFrame}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fair Usage Policy */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">{content.pricing.fairUsage.headline}</h3>
            <p className="text-muted-foreground">{content.pricing.fairUsage.subhead}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {content.pricing.fairUsage.points.map((point: { title: string; description: string }, i: number) => (
              <div key={i} className="space-y-2">
                <h4 className="font-bold flex items-center gap-2">
                  {point.title}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{point.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
