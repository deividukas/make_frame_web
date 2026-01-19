import sharp from "sharp";
import type { Request, Response } from "express";

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "avif" | "jpeg" | "png";
}

export async function optimizeImage(
  inputBuffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<{ buffer: Buffer; contentType: string }> {
  const {
    width,
    height,
    quality = 80,
    format = "webp"
  } = options;

  let pipeline = sharp(inputBuffer);

  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: "inside",
      withoutEnlargement: true
    });
  }

  let outputBuffer: Buffer;
  let contentType: string;

  switch (format) {
    case "avif":
      outputBuffer = await pipeline.avif({ quality }).toBuffer();
      contentType = "image/avif";
      break;
    case "jpeg":
      outputBuffer = await pipeline.jpeg({ quality }).toBuffer();
      contentType = "image/jpeg";
      break;
    case "png":
      outputBuffer = await pipeline.png({ quality }).toBuffer();
      contentType = "image/png";
      break;
    case "webp":
    default:
      outputBuffer = await pipeline.webp({ quality }).toBuffer();
      contentType = "image/webp";
      break;
  }

  return { buffer: outputBuffer, contentType };
}

export async function optimizeImageFromUrl(
  imageUrl: string,
  options: ImageOptimizationOptions = {}
): Promise<{ buffer: Buffer; contentType: string }> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  return optimizeImage(inputBuffer, options);
}

export function parseOptimizationParams(req: Request): ImageOptimizationOptions {
  const width = req.query.w ? parseInt(req.query.w as string) : undefined;
  const height = req.query.h ? parseInt(req.query.h as string) : undefined;
  const quality = req.query.q ? parseInt(req.query.q as string) : 80;
  
  let format: ImageOptimizationOptions["format"] = "webp";
  const formatParam = req.query.f as string;
  if (formatParam && ["webp", "avif", "jpeg", "png"].includes(formatParam)) {
    format = formatParam as ImageOptimizationOptions["format"];
  }

  const accept = req.headers.accept || "";
  if (!formatParam) {
    if (accept.includes("image/avif")) {
      format = "avif";
    } else if (accept.includes("image/webp")) {
      format = "webp";
    }
  }

  return { width, height, quality, format };
}

export function registerImageOptimizationRoutes(app: import("express").Express) {
  app.get("/api/img", async (req: Request, res: Response) => {
    try {
      const url = req.query.url as string;
      if (!url) {
        return res.status(400).json({ error: "URL parameter required" });
      }

      if (!url.startsWith("/objects/") && !url.startsWith("/api/objects/")) {
        return res.status(400).json({ error: "Only local object storage URLs are allowed" });
      }

      const protocol = req.protocol;
      const host = req.get("host");
      const fullUrl = `${protocol}://${host}${url}`;

      const options = parseOptimizationParams(req);
      const { buffer, contentType } = await optimizeImageFromUrl(fullUrl, options);

      res.set({
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Vary": "Accept"
      });

      res.send(buffer);
    } catch (error) {
      console.error("Image optimization error:", error);
      res.status(500).json({ error: "Failed to optimize image" });
    }
  });
}
