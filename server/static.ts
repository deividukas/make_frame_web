import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { storage } from "./storage";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Serve HTML with injected initial data for faster LCP
  app.use("*", async (_req, res) => {
    try {
      const htmlPath = path.resolve(distPath, "index.html");
      let html = fs.readFileSync(htmlPath, "utf-8");
      
      // Make CSS load async to reduce render-blocking
      html = html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
      );
      
      // Fetch initial content from database
      const siteContent = await storage.getSiteContent();
      
      if (siteContent && siteContent.content) {
        // Extract just the content object, not the database row wrapper
        const contentOnly = siteContent.content;
        
        // Safely serialize JSON for inline script to prevent XSS
        // Replace </script> and other potentially dangerous sequences
        const safeJson = JSON.stringify(contentOnly)
          .replace(/</g, '\\u003c')
          .replace(/>/g, '\\u003e')
          .replace(/&/g, '\\u0026')
          .replace(/'/g, '\\u0027');
        
        const dataScript = `window.__INITIAL_DATA__ = ${safeJson};`;
        html = html.replace(
          'window.__INITIAL_DATA__ = null;',
          dataScript
        );
      }
      
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      console.error("Error serving HTML with injected data:", error);
      // Fallback to sending the file without injection
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
