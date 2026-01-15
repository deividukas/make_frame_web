import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-50"
        >
          <div className="bg-white dark:bg-slate-900 border border-border shadow-2xl rounded-2xl p-6 flex flex-col gap-4">
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Cookie Preferences</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use cookies to improve your experience and analyze our traffic using Google Analytics and Meta Pixel. 
                By clicking "Accept", you consent to our use of cookies. Read our{" "}
                <Link href="/privacy" className="text-primary underline underline-offset-4 hover:text-primary/80">
                  Privacy Policy
                </Link>{" "}
                for more details.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShow(false)}>
                Decline
              </Button>
              <Button size="sm" onClick={accept} className="bg-primary text-white">
                Accept
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
