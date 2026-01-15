import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate lg:prose-lg max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8 font-heading">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Effective Date: January 15, 2026</p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using app.make-frame.com ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              Make-Frame provides tools for generating digital frames and overlays. The service is provided "as is" and "as available."
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. User Conduct and Content</h2>
            <p><strong>Lawful Use:</strong> You agree to use the Service only for lawful purposes.</p>
            <p><strong>Prohibited Content:</strong> You may not use the Service to generate, upload, or share content that is illegal, offensive, defamatory, or infringes on any third-party intellectual property rights.</p>
            <p><strong>Anonymity:</strong> While the frame generation is anonymous, you are responsible for any data or images you process through our tools.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
            <p><strong>Our Content:</strong> All software, design, and branding associated with Make-Frame remain our exclusive property.</p>
            <p><strong>User Content:</strong> You retain all rights to the images you upload. We do not claim ownership of your generated frames.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Payments and Subscriptions</h2>
            <p><strong>Processing:</strong> Payments are handled securely via Stripe.</p>
            <p><strong>Refunds:</strong> Due to the digital nature of our service, refunds are generally not provided once a generation or subscription has been used, except as required by law.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Disclaimer of Warranties</h2>
            <p>
              We do not guarantee that the Service will be uninterrupted, error-free, or completely secure. We are not liable for any loss of data or damages resulting from the use of our frame generation tools.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Make-Frame shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
            <p>
              These terms are governed by the laws of Lithuania, without regard to its conflict of law principles.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p>
              For questions regarding these Terms, please contact us at: <a href="mailto:hello@make-frame.com" className="text-primary hover:underline">hello@make-frame.com</a>.
            </p>
          </section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
