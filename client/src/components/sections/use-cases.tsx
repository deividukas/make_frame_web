import { useContent } from "@/lib/content-context";
import { Briefcase, Music, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const icons = [Briefcase, Music, Users];
const colors = ["bg-blue-50 text-blue-600", "bg-purple-50 text-purple-600", "bg-teal-50 text-teal-600"];

export function UseCases() {
  const { content } = useContent();

  return (
    <section id="use-cases" className="py-24 bg-background">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 px-4">
           <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Built for Every Event
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From corporate summits to grassroots movements, Make-frame adapts to your audience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {content.useCases.map((useCase, index) => {
            const Icon = icons[index];
            const colorClass = colors[index];
            
            return (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow bg-slate-50/50">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClass}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-muted-foreground leading-relaxed">
                      {useCase.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
