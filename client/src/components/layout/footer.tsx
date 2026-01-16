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
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Secure payments by</span>
                <svg viewBox="0 0 60 25" className="h-5 w-auto fill-[#635bff]" xmlns="http://www.w3.org/2000/svg">
                  <path d="M59.64 14.28c0-4.59-2.45-7.38-6.14-7.38-3.71 0-5.91 2.82-5.91 7.38 0 4.8 2.25 7.38 6.14 7.38 3.76 0 5.91-2.6 5.91-7.38zM51.13 14.28c0-2.88 1-4.24 2.37-4.24 1.34 0 2.31 1.36 2.31 4.24 0 2.94-.97 4.24-2.31 4.24-1.37 0-2.37-1.3-2.37-4.24zM44.48 11.23c0-3.35-1.57-4.33-4-4.33-1.63 0-3.15.54-4.14 1.15l.63 2c.81-.45 1.95-.87 2.93-.87 1.25 0 1.83.42 1.83 1.4v.7a4.11 4.11 0 0 0-2.34-.73c-2.43 0-4 1.29-4 3.42 0 2.21 1.55 3.32 3.51 3.32 1.48 0 2.51-.55 3.03-1.12l.1.84h2.1l-.22-1.78v-4.01zm-2.73 3.41c0 .87-.69 1.46-1.68 1.46-1 0-1.52-.46-1.52-1.16 0-.75.69-1.2 1.77-1.2a3.86 3.86 0 0 1 1.43.3v.6zM32.54 11.39c0-3.32-1.65-4.49-4.32-4.49-1.5 0-3 .4-3.95.89l.75 1.92c.9-.45 2-.78 2.8-.78 1.46 0 2 .46 2 1.37v.34a5.1 5.1 0 0 0-2.31-.62c-2.65 0-4.43 1.35-4.43 3.61 0 2.26 1.76 3.42 4 3.42a4.48 4.48 0 0 0 3.31-1.42l.14 1.1h2.15l-.23-1.95v-3.41zm-2.8 3.59c0 .94-.74 1.53-1.84 1.53-1.07 0-1.66-.46-1.66-1.24 0-.85.76-1.32 2-1.32a4.25 4.25 0 0 1 1.5.29v.74zM19.46 12.83c0-3.32-1.65-4.63-4.32-4.63a6.83 6.83 0 0 0-4.06 1.31l.88 1.83a5.57 5.57 0 0 1 2.8-.9c1.46 0 2 .55 2 1.48v.34a5.1 5.1 0 0 0-2.31-.62c-2.65 0-4.43 1.35-4.43 3.61 0 2.26 1.76 3.42 4 3.42a4.48 4.48 0 0 0 3.31-1.42l.14 1.1h2.15l-.23-1.95v-3.55zm-2.8 3.58c0 .94-.74 1.53-1.84 1.53-1.07 0-1.66-.46-1.66-1.24 0-.85.76-1.32 2-1.32a4.25 4.25 0 0 1 1.5.29v.74zM9.42 12.83c.98 0 1.78-.34 1.78-1.5 0-1-.8-1.48-1.78-1.48h-2.12v2.98h2.12zm0-4.63c.96 0 1.54-.34 1.54-1.27 0-.96-.58-1.24-1.54-1.24H7.3v2.51h2.12zM7.3 16.48h-2.1V4.28h4.22c2.18 0 3.7.83 3.7 3 0 1.18-.5 2.06-1.48 2.58 1.18.42 1.84 1.48 1.84 2.8 0 2.56-1.84 3.82-4.18 3.82H7.3zM1.42 16.48V8.2c0-3.32 1.65-4.63 4.32-4.63 1.5 0 3 .4 3.95.89l-.75 1.92c-.9-.45-2-.78-2.8-.78-1.46 0-2 .46-2 1.37v.34a5.1 5.1 0 0 0 2.31.62c2.65 0 4.43 1.35 4.43 3.61 0 2.26-1.76 3.42-4 3.42a4.48 4.48 0 0 0-3.31-1.42l-.14 1.1h-2.15l.14-11.23z" transform="scale(1, -1) translate(0, -20)"/>
                </svg>
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
