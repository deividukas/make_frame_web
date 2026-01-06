import { useContent } from "@/lib/content-context";
import { Link } from "wouter";

export function Footer() {
  const { content } = useContent();

  return (
    <footer className="border-t bg-slate-50 dark:bg-slate-950">
      <div className="container max-w-7xl py-12 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold text-primary">{content.navigation.title}</span>
            <p className="text-sm text-muted-foreground">
              {content.footer.copyright}
            </p>
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
            <Link href="/admin-settings" className="hover:text-foreground transition-colors">
              Admin Login
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
