import { Link, useLocation } from "wouter";
import { useContent } from "@/lib/content-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/ui/logo";

export function Navbar() {
  const { content } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <div className="flex items-center gap-6 text-sm font-medium">
            {content.navigation.links.map((link) => (
              <a 
                key={link.label}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground font-semibold px-4">
              <a href="https://app.make-frame.com/login">Sign in</a>
            </Button>
            <Button size="sm" asChild className="font-semibold px-6 h-10 shadow-lg shadow-primary/20">
              <a href={content.hero.cta.href}>{content.hero.cta.text}</a>
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {content.navigation.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                ))}
                <Button className="w-full mt-4" asChild>
                  <a href={content.hero.cta.href}>{content.hero.cta.text}</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
