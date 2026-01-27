import { useContent } from "@/lib/content-context";
import { Link } from "wouter";
import Logo from "@/components/ui/logo";

export function Footer() {
  const { content } = useContent();

  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-950">
      <div className="container max-w-7xl py-12 px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Link href="/" className="flex items-center">
                <Logo className="h-10 w-auto" />
              </Link>
              <p className="text-sm text-muted-foreground mt-2">
                {content.footer.copyright}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white border rounded-md shadow-sm">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 whitespace-nowrap">Secure payments by</span>
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                  alt="Stripe" 
                  className="h-4 w-auto opacity-80"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          
          <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
            {content.footer.links.map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
