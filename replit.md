# Make-frame Landing Page

## Overview

Make-frame is a marketing landing page for a photo frame generator service designed for event organizers. The application allows event organizers to create branded photo frames that attendees can use to generate and share professional, branded photos on social media. The landing page showcases features, pricing, use cases, and includes an admin panel for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

## Technical Standards (SEO & AIO)

### Core Principles
- **Environment**: Everything developed and hosted on Replit
- **Single Source of Truth (SSOT)**: No in-memory storage. All persistent data must reside in PostgreSQL
- **Type Safety**: Strict TypeScript control. No `any` types. All database schemas have TypeScript interfaces via Drizzle ORM
- **Performance**: Target US market. Minimize LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift)

### SEO Requirements
- **Server-Side Metadata**: All SEO titles, descriptions, and OpenGraph tags must be dynamic from database
- **Semantic HTML5**: Use proper tags: `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`. Avoid "div-soup"
- **Heading Hierarchy**: Strict `<h1>` to `<h6>` structure. Only one `<h1>` per page
- **URL Structure**: Clean, descriptive slugs (e.g., `/resources/how-to-use-frame-generator`)
- **Image Optimization**: Use Sharp library for server-side processing. Generate AVIF or WebP versions
- **JSON-LD Schema**: Automatically generate for SoftwareApplication, Article, and Organization

### Typography & Accessibility
- **Base Font Size**: 16px for body text (override default 14px for content-heavy pages)
- **Line Height**: Minimum 1.5 for body text
- **Fonts**:
  - Primary (Sans): Inter
  - Headings: Geist
  - Mono: Geist Mono
- **Contrast**: All text colors must meet WCAG 2.1 AA standards (minimum 4.5:1 ratio)

### AI Optimization (AIO)
- **AI Contextual Anchors**: Add "Key Takeaways" or "Summary" section at top of long-form content
- **Logical Chunking**: Use `<section>` with clear `id` attributes for AI navigation

### Design Tokens
- **Border Radius**: `--radius: 0.5rem` (8px)
- **Primary Color**: `--primary: #7c3aed`
- **Background**: `hsl(240, 5%, 98%)`

### Database Tables
- **seo_metadata**: id, path, title, description, og_image, canonical_url
- **resources**: id, slug, title, content, excerpt, key_takeaways, featured_image, featured_image_alt, meta_title, meta_description, published_at

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Context for content management
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page animations
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints under `/api` prefix
- **Development**: Hot module replacement via Vite middleware in development mode
- **Production**: Static file serving from built assets

### Data Storage
- **Database**: PostgreSQL via `pg` driver
- **ORM**: Drizzle ORM with Zod schema validation
- **Schema**: Tables - `users`, `site_content`, `resources`, `seo_metadata`
- **Migrations**: Drizzle Kit for schema management (`drizzle-kit push`)

### Content Management
- Site content stored as JSON in database with fallback to static `content.json`
- Admin panel at `/admin-settings` for editing content
- Password-protected admin access via localStorage and custom header

### Key Design Patterns
- **Monorepo Structure**: Shared types between client/server in `/shared` directory
- **Path Aliases**: `@/` for client source, `@shared/` for shared code
- **Component Library**: Full shadcn/ui installation with Radix UI primitives
- **Type Safety**: Drizzle-Zod integration for end-to-end type safety

## External Dependencies

### Database
- PostgreSQL (required, configured via `DATABASE_URL` environment variable)
- Connection pooling via `pg.Pool`

### Third-Party Services
- **Stripe**: Payment processing (SDK bundled, integration ready)
- **Google Fonts**: Geist and Inter font families loaded via CDN
- **Sharp**: Image processing for AVIF/WebP optimization

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animation library
- `react-hook-form` / `@hookform/resolvers`: Form handling with Zod validation
- `wouter`: Client-side routing
- `connect-pg-simple`: PostgreSQL session store (available for auth expansion)
- `sharp`: Image optimization and format conversion

### Build & Development
- Vite for frontend bundling
- esbuild for server bundling (production)
- Custom Vite plugins for Replit-specific features (cartographer, dev banner, meta images)
