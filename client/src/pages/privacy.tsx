import { motion } from "framer-motion";
import { useContent } from "@/lib/content-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Privacy() {
  const { content } = useContent();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate lg:prose-lg max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8 font-heading">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: January 15, 2026</p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to Make-frame.com. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you as to how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
            <p>
              We use Google Analytics, Google Tag Manager (GTM), and Meta Pixel to collect information about how visitors 
              use our site. This helps us improve our service and marketing efforts. The data collected includes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Usage data (pages visited, time spent on site)</li>
              <li>Device information (browser type, operating system)</li>
              <li>Referral sources</li>
              <li>Marketing interaction data</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. Cookies</h2>
            <p>
              We use cookies to track activity on our website and hold certain information. 
              Cookies are files with small amount of data which may include an anonymous unique identifier.
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
            <p>
              Our website uses:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Google Analytics / GTM:</strong> For tracking website traffic and performance.</li>
              <li><strong>Meta Pixel:</strong> For measuring the effectiveness of our advertising.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at hello@make-frame.com.
            </p>
          </section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
