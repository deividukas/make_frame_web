# Make-frame Landing Page

## Overview

Make-frame is a marketing landing page for a photo frame generator service designed for event organizers. The application allows event organizers to create branded photo frames that attendees can use to generate and share professional, branded photos on social media. The landing page showcases features, pricing, use cases, and includes an admin panel for content management.

## User Preferences

Preferred communication style: Simple, everyday language.

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
- **Schema**: Two tables - `users` (authentication) and `site_content` (CMS content as JSONB)
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

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animation library
- `react-hook-form` / `@hookform/resolvers`: Form handling with Zod validation
- `wouter`: Client-side routing
- `connect-pg-simple`: PostgreSQL session store (available for auth expansion)

### Build & Development
- Vite for frontend bundling
- esbuild for server bundling (production)
- Custom Vite plugins for Replit-specific features (cartographer, dev banner, meta images)