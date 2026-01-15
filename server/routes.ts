import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const defaultContent = {
  navigation: {
    title: "Make-frame",
    links: [
      { label: "Demo", href: "#demo" },
      { label: "Price", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Resources", href: "#resources" }
    ]
  },
  hero: {
    headline: "Your Attendees Are Your Best Ad Agency",
    subhead: "The easiest photo frame generator built for event organizers. Transform attendee selfies into professional, branded posts that grow your organic reach.",
    cta: { text: "Get Started Free", href: "https://staging.make-frame.com/signup" }
  },
  howItWorks: [
    { title: "1. Upload Your Frame", description: "Create and upload your branded PNG frame. Use our Theme Editor to match the tool's look to your event's identity in minutes." },
    { title: "2. Share the Link", description: "Embed the generator into your website or share a direct link. Attendees upload their selfies, and our system perfectly fits them into your frame." },
    { title: "3. Watch the Growth", description: "Attendees download and share their professional, branded photos. Your event's message spreads across social feeds through authentic recommendations." }
  ],
  demo: {
    headline: "Experience it like your attendees will",
    subhead: "Don't just take our word for it. Try our live demo to see how seamless the photo experience is on any device.",
    cta: { text: "View Live Demo", href: "#" }
  },
  useCases: [
    { title: "Business Conferences & Summits", description: "Turn networking into marketing. Give your attendees a professional way to share their experience. Boost sponsor visibility and dominate LinkedIn and X feeds with high-quality, branded content that builds professional authority." },
    { title: "Music Festivals & Concerts", description: "Drive viral ticket sales. Your fans are your best promoters. Let them announce their arrival with high-energy frames designed to go viral on Instagram Stories and TikTok. Turn every selfie into an authentic organic ad that their friends can't miss." },
    { title: "Grassroots Movements", description: "Amplify your voice without a marketing budget. Whether it's a social cause or a local rally, help supporters spread a unified message across Facebook and X. Turn every selfie into a digital placard that makes your movement impossible to ignore in social discussions." }
  ],
  pricing: {
    free: { 
      price: "$0", 
      title: "Free Trial", 
      description: "Best for: Testing the experience or small, daily activations.",
      features: ["5 photo frames per day", "Full Admin Dashboard Access", "Frame & Theme Editor", "Iframe Integration Guide"] 
    },
    premium: { 
      price: "$69", 
      title: "Premium", 
      description: "Best for: Professional organizers and marketing teams.",
      features: ["200 photo frames per month", "Extended Usage Statistics", "Rollover Credits", "Top-up Eligibility", "Everything in Free Trial"] 
    },
    addOns: [
      { size: "Small", count: "1,000 frames", price: "$40", perFrame: "$0.04 / frame" },
      { size: "Medium", count: "5,000 frames", price: "$150", perFrame: "$0.03 / frame" },
      { size: "Large", count: "20,000 frames", price: "$400", perFrame: "$0.02 / frame" }
    ],
    fairUsage: {
      headline: "Never Lose What You Pay For",
      subhead: "Our Fair Usage Policy ensures you get every bit of value from your subscription.",
      points: [
        { title: "Smart Rollover", description: "Unused monthly credits don't just vanish. They automatically roll over to the next month. You can accumulate up to 600 compositions (300% of your base plan)." },
        { title: "Fair Usage Logic", description: "Our system is built with your budget in mind. We always use your rolled-over credits first, followed by your current monthly limit. Your purchased Extra Frame Packages are only touched once everything else is used up." },
        { title: "Permanent Add-ons", description: "Need extra capacity for a massive event? Our Extra Frame Packages never expire. As long as your Premium subscription is active, those credits stay in your account until you actually use them." }
      ]
    }
  },
  footer: {
    copyright: "© 2026 Make-frame.com. All rights reserved.",
    links: [
      { label: "About", href: "#" },
      { label: "Contacts", href: "/contacts" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Twitter", href: "#" },
      { label: "LinkedIn", href: "#" }
    ]
  }
};

const contentSchema = z.object({
  navigation: z.object({
    title: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.string() }))
  }),
  hero: z.object({
    headline: z.string(),
    subhead: z.string(),
    cta: z.object({ text: z.string(), href: z.string() })
  }),
  howItWorks: z.array(z.object({ title: z.string(), description: z.string() })),
  demo: z.object({
    headline: z.string(),
    subhead: z.string(),
    cta: z.object({ text: z.string(), href: z.string() })
  }),
  useCases: z.array(z.object({ title: z.string(), description: z.string() })),
  pricing: z.object({
    free: z.object({
      price: z.string(),
      title: z.string(),
      description: z.string(),
      features: z.array(z.string())
    }),
    premium: z.object({
      price: z.string(),
      title: z.string(),
      description: z.string(),
      features: z.array(z.string())
    }),
    addOns: z.array(z.object({
      size: z.string(),
      count: z.string(),
      price: z.string(),
      perFrame: z.string()
    })),
    fairUsage: z.object({
      headline: z.string(),
      subhead: z.string(),
      points: z.array(z.object({ title: z.string(), description: z.string() }))
    })
  }),
  footer: z.object({
    copyright: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.string() }))
  })
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get site content - auto-seeds with defaults if not found
  app.get("/api/content", async (req, res) => {
    try {
      let content = await storage.getSiteContent();
      if (!content) {
        content = await storage.upsertSiteContent(defaultContent);
      }
      res.json(content.content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Update site content with validation and simple password protection
  app.put("/api/content", async (req, res) => {
    try {
      const encodedPassword = req.headers["x-admin-password-encoded"] as string;
      let adminPassword = "";
      
      if (encodedPassword) {
        try {
          adminPassword = Buffer.from(encodedPassword, 'base64').toString('utf-8');
        } catch (e) {
          console.error("Failed to decode password header");
        }
      } else {
        // Fallback for old header if needed
        adminPassword = req.headers["x-admin-password"] as string;
      }

      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const parseResult = contentSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid content structure", details: parseResult.error.errors });
      }
      const result = await storage.upsertSiteContent(parseResult.data);
      res.json(result.content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  // Reset content to defaults
  app.post("/api/content/reset", async (req, res) => {
    try {
      const result = await storage.upsertSiteContent(defaultContent);
      res.json(result.content);
    } catch (error) {
      console.error("Error resetting content:", error);
      res.status(500).json({ error: "Failed to reset content" });
    }
  });

  // Contact form endpoint with spam protection
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message, confirm_email_address, loadTime, submitTime } = req.body;

      // 1. Honeypot check
      if (confirm_email_address) {
        console.log("Spam detected: Honeypot field filled");
        return res.json({ success: true });
      }

      // 2. Timestamp check (5 second threshold)
      const duration = submitTime - loadTime;
      if (duration < 5000) {
        console.log(`Spam detected: Form submitted in ${duration}ms`);
        return res.json({ success: true });
      }

      // In a real production app, we would send an email here
      console.log("Contact form submission validated:", { name, email, subject, message });

      res.json({ success: true });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
