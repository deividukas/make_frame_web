import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { insertResourceSchema, insertSeoMetadataSchema, insertLandingPageSchema } from "@shared/schema";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { registerImageOptimizationRoutes } from "./image-optimizer";

const defaultContent = {
  navigation: {
    title: "Make-frame",
    links: [
      { label: "Demo", href: "https://staging.make-frame.com/demo" },
      { label: "Price", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Resources", href: "#resources" }
    ],
    signIn: { text: "Sign in", href: "https://app.make-frame.com/login" },
    getStarted: { text: "Get Started Free", href: "https://staging.make-frame.com/signup" }
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
    cta: { text: "View Live Demo", href: "https://staging.make-frame.com/demo" }
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
  },
  resourcesPage: {
    headline: "News & Tips",
    subhead: "Learn more about event photography, social media marketing, and Make-frame capabilities."
  }
};

const contentSchema = z.object({
  navigation: z.object({
    title: z.string(),
    links: z.array(z.object({ label: z.string(), href: z.string() })),
    signIn: z.object({ text: z.string(), href: z.string() }).optional(),
    getStarted: z.object({ text: z.string(), href: z.string() }).optional()
  }),
  hero: z.object({
    headline: z.string(),
    subhead: z.string(),
    cta: z.object({ text: z.string(), href: z.string() }),
    backgroundImage: z.string().optional()
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
  }),
  resourcesPage: z.object({
    headline: z.string().optional(),
    subhead: z.string().optional()
  }).optional().transform((val) => ({
    headline: val?.headline || "News & Tips",
    subhead: val?.subhead || "Learn more about event photography, social media marketing, and Make-frame capabilities."
  }))
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

  // Contact form schema
  const contactSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email().max(255),
    subject: z.string().min(1).max(200),
    message: z.string().min(1).max(5000),
    confirm_email_address: z.string().optional(),
    loadTime: z.number(),
    submitTime: z.number()
  });

  // HTML escape helper
  function escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Contact form endpoint with spam protection
  app.post("/api/contact", async (req, res) => {
    try {
      // Validate input
      const parseResult = contactSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid form data" });
      }

      const { name, email, subject, message, confirm_email_address, loadTime, submitTime } = parseResult.data;

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

      // Send email via MailerSend
      const apiKey = process.env.MAILERSEND_API_KEY;
      const adminEmail = process.env.ADMIN_EMAIL;

      if (!apiKey || !adminEmail) {
        console.log("MailerSend not configured, logging contact form:", { name, email, subject, message });
        return res.json({ success: true });
      }

      const mailerSend = new MailerSend({ apiKey });

      const sentFrom = new Sender("noreply@make-frame.com", "Make-Frame Contact Form");
      const recipients = [new Recipient(adminEmail, "Admin")];

      // Escape HTML to prevent injection
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeSubject = escapeHtml(subject);
      const safeMessage = escapeHtml(message);

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(new Recipient(email, name))
        .setSubject(`Contact Form: ${subject}`)
        .setHtml(`
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${safeMessage.replace(/\n/g, '<br>')}</p>
        `)
        .setText(`New Contact Form Submission\n\nFrom: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`);

      await mailerSend.email.send(emailParams);
      console.log("Contact form email sent successfully to:", adminEmail);

      res.json({ success: true });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============ SITEMAP ============
  
  app.get("/sitemap.xml", async (req, res) => {
    const BASE_URL = "https://make-frame.com";
    const today = new Date().toISOString().split("T")[0];

    const toDate = (value: string | Date | null | undefined): string => {
      if (!value) return today;
      const d = new Date(value);
      return isNaN(d.getTime()) ? today : d.toISOString().split("T")[0];
    };

    const urlEntry = (
      loc: string,
      lastmod: string,
      changefreq: string,
      priority: string
    ): string =>
      [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");

    try {
      const [resources, landingPages] = await Promise.all([
        storage.getPublishedResources(),
        storage.getPublishedLandingPages(),
      ]);

      const staticPages = [
        urlEntry(`${BASE_URL}/`, today, "weekly", "1.0"),
        urlEntry(`${BASE_URL}/resources`, today, "daily", "0.8"),
        urlEntry(`${BASE_URL}/faq`, today, "weekly", "0.8"),
        urlEntry(`${BASE_URL}/contacts`, today, "monthly", "0.5"),
        urlEntry(`${BASE_URL}/privacy`, today, "yearly", "0.3"),
        urlEntry(`${BASE_URL}/terms`, today, "yearly", "0.3"),
      ];

      const resourcePages = resources.map((r) =>
        urlEntry(
          `${BASE_URL}/resources/${r.slug}`,
          toDate(r.updatedAt),
          "weekly",
          "0.7"
        )
      );

      const lpPages = landingPages.map((p) =>
        urlEntry(
          `${BASE_URL}/lp/${p.slug}`,
          toDate(p.updatedAt),
          "weekly",
          "0.6"
        )
      );

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...staticPages,
        ...resourcePages,
        ...lpPages,
        "</urlset>",
        "",
      ].join("\n");

      res.header("Content-Type", "application/xml; charset=utf-8");
      res.header("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // ============ SEO META FOR BOTS ============
  
  app.get("/resources/:slug", async (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    const isBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|discord/i.test(userAgent);
    
    if (!isBot) {
      return next();
    }
    
    try {
      const resource = await storage.getResourceBySlug(req.params.slug);
      if (!resource || !resource.isPublished) {
        return next();
      }
      
      const baseUrl = "https://make-frame.com";
      const rawTitle = resource.metaTitle || resource.title;
      const rawDescription = resource.metaDescription || resource.excerpt || '';
      const rawImage = resource.featuredImage || '/opengraph.png';
      const image = rawImage.startsWith("/") ? `${baseUrl}${rawImage}` : rawImage;
      const url = `${baseUrl}/resources/${resource.slug}`;

      res.setHeader("Link", `<${url}>; rel="canonical"`);
      
      const safeTitle = escapeHtml(rawTitle);
      const safeDescription = escapeHtml(rawDescription);
      const safeHeadline = escapeHtml(resource.title);
      const safeContent = escapeHtml(resource.content);
      
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": resource.title,
        "description": rawDescription,
        "image": image || undefined,
        "datePublished": resource.publishedAt,
        "dateModified": resource.updatedAt,
        "author": {
          "@type": "Organization",
          "name": "Make-frame",
          "url": baseUrl
        },
        "publisher": {
          "@type": "Organization",
          "name": "Make-frame",
          "url": baseUrl
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        }
      };
      
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} | Make-frame</title>
  <meta name="description" content="${safeDescription}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDescription}">
  <meta name="twitter:image" content="${escapeHtml(image)}">
  <link rel="canonical" href="${url}">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <article>
    <h1>${safeHeadline}</h1>
    <div>${safeContent}</div>
  </article>
</body>
</html>`;
      
      res.send(html);
    } catch (error) {
      console.error("Error serving bot content:", error);
      next();
    }
  });

  // ============ RESOURCES API ============

  registerObjectStorageRoutes(app);
  registerImageOptimizationRoutes(app);

  // Helper to verify admin password
  const verifyAdminPassword = (req: any): boolean => {
    const encodedPassword = req.headers["x-admin-password-encoded"] as string;
    let adminPassword = "";
    
    if (encodedPassword) {
      try {
        adminPassword = Buffer.from(encodedPassword, 'base64').toString('utf-8');
      } catch (e) {
        console.error("Failed to decode password header");
      }
    } else {
      adminPassword = req.headers["x-admin-password"] as string;
    }

    return adminPassword === process.env.ADMIN_PASSWORD;
  };

  // Get all published resources (public)
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.getPublishedResources();
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  // Get all resources including drafts (admin only)
  app.get("/api/admin/resources", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const resources = await storage.getAllResources();
      res.json(resources);
    } catch (error) {
      console.error("Error fetching all resources:", error);
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  // Get single resource by slug (public)
  app.get("/api/resources/:slug", async (req, res) => {
    try {
      const resource = await storage.getResourceBySlug(req.params.slug);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      if (!resource.isPublished) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      console.error("Error fetching resource:", error);
      res.status(500).json({ error: "Failed to fetch resource" });
    }
  });

  // Get single resource by ID (admin only)
  app.get("/api/admin/resources/:id", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const resource = await storage.getResourceById(parseInt(req.params.id));
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      console.error("Error fetching resource:", error);
      res.status(500).json({ error: "Failed to fetch resource" });
    }
  });

  // Create resource (admin only)
  app.post("/api/admin/resources", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const parseResult = insertResourceSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid resource data", details: parseResult.error.errors });
      }

      // Check for duplicate slug
      const existingResource = await storage.getResourceBySlug(parseResult.data.slug);
      if (existingResource) {
        return res.status(400).json({ error: "A resource with this slug already exists" });
      }

      const resource = await storage.createResource(parseResult.data);
      res.status(201).json(resource);
    } catch (error) {
      console.error("Error creating resource:", error);
      res.status(500).json({ error: "Failed to create resource" });
    }
  });

  // Update resource (admin only)
  app.put("/api/admin/resources/:id", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const existingResource = await storage.getResourceById(id);
      if (!existingResource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      // Check for duplicate slug if it changed
      if (req.body.slug && req.body.slug !== existingResource.slug) {
        const slugResource = await storage.getResourceBySlug(req.body.slug);
        if (slugResource) {
          return res.status(400).json({ error: "A resource with this slug already exists" });
        }
      }

      const resource = await storage.updateResource(id, req.body);
      res.json(resource);
    } catch (error) {
      console.error("Error updating resource:", error);
      res.status(500).json({ error: "Failed to update resource" });
    }
  });

  // Delete resource (admin only)
  app.delete("/api/admin/resources/:id", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const deleted = await storage.deleteResource(id);
      if (!deleted) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting resource:", error);
      res.status(500).json({ error: "Failed to delete resource" });
    }
  });

  // ============ SEO METADATA API ============

  // Get all SEO metadata (admin only)
  app.get("/api/admin/seo-metadata", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const seoList = await storage.getAllSeoMetadata();
      res.json(seoList);
    } catch (error) {
      console.error("Error fetching SEO metadata:", error);
      res.status(500).json({ error: "Failed to fetch SEO metadata" });
    }
  });

  // Get SEO metadata by path (public, for SSR)
  app.get("/api/seo-metadata", async (req, res) => {
    try {
      const path = req.query.path as string;
      if (!path) {
        return res.status(400).json({ error: "Path parameter required" });
      }
      const seo = await storage.getSeoMetadataByPath(path);
      res.json(seo || null);
    } catch (error) {
      console.error("Error fetching SEO metadata:", error);
      res.status(500).json({ error: "Failed to fetch SEO metadata" });
    }
  });

  // Get SEO metadata by ID (admin only)
  app.get("/api/admin/seo-metadata/:id", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const seo = await storage.getSeoMetadataById(parseInt(req.params.id));
      if (!seo) {
        return res.status(404).json({ error: "SEO metadata not found" });
      }
      res.json(seo);
    } catch (error) {
      console.error("Error fetching SEO metadata:", error);
      res.status(500).json({ error: "Failed to fetch SEO metadata" });
    }
  });

  // Create SEO metadata (admin only)
  app.post("/api/admin/seo-metadata", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const parseResult = insertSeoMetadataSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid SEO metadata", details: parseResult.error.errors });
      }

      // Check for duplicate path
      const existing = await storage.getSeoMetadataByPath(parseResult.data.path);
      if (existing) {
        return res.status(400).json({ error: "SEO metadata for this path already exists" });
      }

      const seo = await storage.createSeoMetadata(parseResult.data);
      res.status(201).json(seo);
    } catch (error) {
      console.error("Error creating SEO metadata:", error);
      res.status(500).json({ error: "Failed to create SEO metadata" });
    }
  });

  // Update SEO metadata (admin only)
  app.put("/api/admin/seo-metadata/:id", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const existing = await storage.getSeoMetadataById(id);
      if (!existing) {
        return res.status(404).json({ error: "SEO metadata not found" });
      }

      // Check for duplicate path if it changed
      if (req.body.path && req.body.path !== existing.path) {
        const pathExists = await storage.getSeoMetadataByPath(req.body.path);
        if (pathExists) {
          return res.status(400).json({ error: "SEO metadata for this path already exists" });
        }
      }

      const seo = await storage.updateSeoMetadata(id, req.body);
      res.json(seo);
    } catch (error) {
      console.error("Error updating SEO metadata:", error);
      res.status(500).json({ error: "Failed to update SEO metadata" });
    }
  });

  // Delete SEO metadata (admin only)
  app.delete("/api/admin/seo-metadata/:id", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSeoMetadata(id);
      if (!deleted) {
        return res.status(404).json({ error: "SEO metadata not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting SEO metadata:", error);
      res.status(500).json({ error: "Failed to delete SEO metadata" });
    }
  });

  // ============ FAQ API ============

  // Get all published FAQ items (public)
  app.get("/api/faq", async (req, res) => {
    try {
      const items = await storage.getPublishedFaqItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching FAQ items:", error);
      res.status(500).json({ error: "Failed to fetch FAQ items" });
    }
  });

  // Get all FAQ items (admin only)
  app.get("/api/admin/faq", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const items = await storage.getAllFaqItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching all FAQ items:", error);
      res.status(500).json({ error: "Failed to fetch FAQ items" });
    }
  });

  // Create FAQ item (admin only)
  app.post("/api/admin/faq", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { category, question, answer, isPublished } = req.body;
      if (!category || !question || !answer) {
        return res.status(400).json({ error: "Category, question, and answer are required" });
      }

      const faq = await storage.createFaqItem({
        category,
        question,
        answer,
        isPublished: isPublished ?? true,
      });
      res.status(201).json(faq);
    } catch (error) {
      console.error("Error creating FAQ item:", error);
      res.status(500).json({ error: "Failed to create FAQ item" });
    }
  });

  // Update FAQ item (admin only)
  app.put("/api/admin/faq/:id", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const existing = await storage.getFaqItemById(id);
      if (!existing) {
        return res.status(404).json({ error: "FAQ item not found" });
      }

      const faq = await storage.updateFaqItem(id, req.body);
      res.json(faq);
    } catch (error) {
      console.error("Error updating FAQ item:", error);
      res.status(500).json({ error: "Failed to update FAQ item" });
    }
  });

  // Delete FAQ item (admin only)
  app.delete("/api/admin/faq/:id", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id);
      const deleted = await storage.deleteFaqItem(id);
      if (!deleted) {
        return res.status(404).json({ error: "FAQ item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting FAQ item:", error);
      res.status(500).json({ error: "Failed to delete FAQ item" });
    }
  });

  // ============ SITE SETTINGS API ============

  // Get site settings (public - for GTM injection)
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings || { gtmId: null });
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ error: "Failed to fetch site settings" });
    }
  });

  // Update site settings (admin only)
  app.put("/api/admin/settings", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { gtmId } = req.body;
      const settings = await storage.upsertSiteSettings({ gtmId: gtmId || null });
      res.json(settings);
    } catch (error) {
      console.error("Error updating site settings:", error);
      res.status(500).json({ error: "Failed to update site settings" });
    }
  });

  // ============ LANDING PAGES API ============

  app.get("/api/admin/landing-pages", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const pages = await storage.getAllLandingPages();
      res.json(pages);
    } catch (error) {
      console.error("Error fetching landing pages:", error);
      res.status(500).json({ error: "Failed to fetch landing pages" });
    }
  });

  app.get("/api/landing-pages/:slug", async (req, res) => {
    try {
      const page = await storage.getLandingPageBySlug(req.params.slug);
      if (!page || !page.isPublished) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching landing page:", error);
      res.status(500).json({ error: "Failed to fetch landing page" });
    }
  });

  app.post("/api/admin/landing-pages", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const parseResult = insertLandingPageSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid data", details: parseResult.error.errors });
      }
      const existing = await storage.getLandingPageBySlug(parseResult.data.slug);
      if (existing) {
        return res.status(400).json({ error: "A page with this slug already exists" });
      }
      const page = await storage.createLandingPage(parseResult.data);
      res.status(201).json(page);
    } catch (error) {
      console.error("Error creating landing page:", error);
      res.status(500).json({ error: "Failed to create landing page" });
    }
  });

  app.put("/api/admin/landing-pages/:id", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = parseInt(req.params.id);
      const existing = await storage.getLandingPageById(id);
      if (!existing) {
        return res.status(404).json({ error: "Page not found" });
      }
      if (req.body.slug && req.body.slug !== existing.slug) {
        const slugPage = await storage.getLandingPageBySlug(req.body.slug);
        if (slugPage) {
          return res.status(400).json({ error: "A page with this slug already exists" });
        }
      }
      const page = await storage.updateLandingPage(id, req.body);
      res.json(page);
    } catch (error) {
      console.error("Error updating landing page:", error);
      res.status(500).json({ error: "Failed to update landing page" });
    }
  });

  app.delete("/api/admin/landing-pages/:id", async (req, res) => {
    try {
      if (!verifyAdminPassword(req)) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteLandingPage(id);
      if (!deleted) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting landing page:", error);
      res.status(500).json({ error: "Failed to delete landing page" });
    }
  });

  return httpServer;
}
