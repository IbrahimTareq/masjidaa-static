# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Masjidaa is a comprehensive masjid management platform built with Next.js 15 and deployed on Cloudflare Pages. The application provides mosque management features including prayer times, events, donations, announcements, and business advertisements.

## Development Commands

```bash
# Development server with Turbopack
npm run dev
# or
pnpm dev

# Build for production
npm run build

# Start production server locally
npm run start

# Lint code
npm run lint

# Deploy to Cloudflare (production)
npm run deploy

# Preview deployment locally
npm run preview

# Generate TypeScript types from Supabase
npm run generate-types

# Generate Cloudflare environment types
npm run cf-typegen
```

## Tech Stack & Architecture

### Core Technologies
- **Next.js 15** with App Router and React 19
- **TypeScript** with strict type checking
- **Tailwind CSS** with custom theme variables
- **Supabase** for database and authentication
- **Cloudflare Pages** for hosting with OpenNext
- **Stripe** for payment processing
- **PostHog** for analytics

### Key Architecture Patterns

**Server-Side Services Pattern**: Business logic is centralized in `lib/server/services/` with cached functions using React's `cache()` for database operations.

**Dynamic Routing Structure**: The app uses slug-based routing (`app/[slug]/`) where slugs can represent either:
- Individual masjid pages (`/masjid-name`)
- System pages (`/about`, `/contact`)

**Embed System**: Comprehensive embed system in `app/masjid/[id]/embed/` for widgets like prayer times, events calendar, donations, and announcements that can be embedded in external websites.

**Theme System**: Dynamic theming using CSS custom properties with masjid-specific color schemes stored in context.

### Database Integration
- Auto-generated TypeScript types in `database.types.ts` from Supabase schema
- Cached server-side data fetching functions in `lib/server/services/`
- Client-side utilities in `utils/supabase/` for browser and server environments

## Project Structure

```
app/
├── [slug]/                    # Dynamic routing for masjids and system pages
├── masjid/[id]/              # Individual masjid pages
│   ├── embed/                # Embeddable widgets
│   └── layout/               # Masjid-specific layouts
├── globals.css               # Global styles with theme variables
└── layout.tsx                # Root layout with fonts and analytics

lib/server/
├── actions/                  # Server actions for form handling
├── services/                 # Cached database operations
├── domain/                   # Business logic models
└── formatters/               # Data formatting utilities

components/
├── client/                   # Client-side React components
└── server/                   # Server components

hooks/                        # Custom React hooks for:
├── usePrayerRealtime.ts     # Real-time prayer time updates
├── useTheme.ts              # Theme management
├── useCountdown.ts          # Prayer countdown functionality
└── usePaymentStatus.ts      # Stripe payment tracking

utils/
├── supabase/                # Supabase client utilities
├── prayer/                  # Prayer time calculations
├── currency/                # Currency formatting
└── time/                    # Time zone handling

context/                     # React contexts for:
├── masjidContext.tsx       # Current masjid data
├── dateTimeContext.tsx     # Date/time settings
└── masjidSiteSettingsContext.tsx # Site-specific settings
```

## Database Schema

The application uses Supabase with TypeScript types auto-generated from the schema. Key tables include:
- `masjids` - Mosque information and settings
- `donations` - Donation campaigns and tracking
- `events` - Event management and registrations
- `ad_requests` - Business advertisement system
- `prayer_times` - Prayer time data and settings

## Development Guidelines

### Environment Setup
- Copy `.env.staging` to `.env` for local development
- Ensure Supabase project credentials are configured
- Run `npm run cf-typegen` after modifying Cloudflare bindings

### Type Generation
- Run `npm run generate-types` after database schema changes
- Types are generated from Supabase and stored in `database.types.ts`

### Deployment
- **Staging**: Automatic deployment to `masjidaa-static-staging` worker
- **Production**: Manual deployment with `npm run deploy` to `masjidaa.com`
- Uses OpenNext for Cloudflare Pages compatibility

### Server Components & Caching
- Prefer server components for data fetching
- Use React's `cache()` wrapper for database calls in services
- Server-side services should handle error cases gracefully

### Embed Development
- Embed routes are in `app/masjid/[id]/embed/[widget]/`
- Each embed supports theme customization via URL parameters
- Consider responsive design for various embed contexts

### Payment Integration
- Stripe integration for donations and business ads
- Payment status tracking via webhooks and client-side polling
- Test payments using Stripe test mode credentials

## Common Patterns

### Server Service Example
```typescript
export const getMasjidBySlug = cache(async (
  slug: string
): Promise<Tables<"masjids"> | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("masjids")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching masjid", error);
    return null;
  }
  return data;
});
```

### Theme Usage
```typescript
// Access theme colors via CSS custom properties
className="bg-theme text-theme-accent border-theme-gradient"
```

### Context Usage
- Wrap components with appropriate context providers
- Use contexts for masjid-specific data, theme settings, and date/time preferences