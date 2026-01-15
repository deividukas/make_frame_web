import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Privacy() {
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
          <p className="text-muted-foreground mb-8">Effective Date: January 15, 2026</p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Make-Frame ("we," "our," or "us") provides a frame generation service. We prioritize user privacy and operate under a principle of data minimization. This policy explains how we handle the limited information we collect at app.make-frame.com.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Anonymous Service and Data Collection</h2>
            <p><strong>Frame Generation:</strong> Our core service is anonymous. We do not collect, store, or monitor any personal data or images uploaded for the purpose of frame generation.</p>
            <p><strong>Account Information:</strong> We only require your email address for account creation, service access, and communication.</p>
            <p><strong>Payment Data:</strong> All personal and financial data required for payments (name, address, billing details) is handled exclusively by Stripe. We do not store or have access to your full payment information.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. Third-Party Analytics and Tracking (Cookies)</h2>
            <p>We use cookies to improve user experience and analyze traffic. By using our service, you consent to the use of:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Essential Cookies:</strong> Required for login sessions and security.</li>
              <li><strong>Analytics Cookies (Google Analytics & GTM):</strong> To understand how users interact with our site.</li>
              <li><strong>Marketing Cookies (Meta Pixel & Others):</strong> To measure the effectiveness of our advertising and provide relevant content. You can manage your cookie preferences through your browser settings.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
            <p>We only share your email address with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Google:</strong> For secure authentication.</li>
              <li><strong>MailerLite:</strong> To manage email verification and newsletters (subject to your Double Opt-in).</li>
              <li><strong>Stripe:</strong> To facilitate secure billing.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p>
              You have the right to access, correct, or request the deletion of your email address from our systems at any time. To exercise these rights, please contact our support.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p>
              For any privacy-related inquiries, please contact us at: <a href="/contacts" className="text-primary hover:underline">Contact Form</a>.
            </p>
          </section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
