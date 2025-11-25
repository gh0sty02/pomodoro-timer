# Metadata Configuration

## Overview

The Pomodoro Timer app includes comprehensive metadata for SEO, social sharing, PWA support, and mobile optimization.

## Files

### 1. Layout Metadata (`app/layout.tsx`)

- **Title**: "Pomodoro Timer - Focus Session & Break Timer"
- **Description**: Full description for search engines and social sharing
- **Keywords**: productivity, focus, timer, time management, pomodoro
- **Open Graph**: Twitter Card, Facebook, LinkedIn sharing
- **Robots**: Indexed and followed by search engines
- **Viewport**: Mobile-optimized settings
- **Icons**: Favicon, Apple touch icon, manifest

### 2. Web App Manifest (`public/site.webmanifest`)

PWA-ready manifest with:

- App name and short name
- Standalone display mode
- Theme colors (dark mode friendly)
- Icon assets for various sizes
- App shortcuts for focus/break sessions
- Screenshot examples for app stores
- Categories: productivity

### 3. Robots.txt (`public/robots.txt`)

- Allows search engine crawling
- Blocks `.next/` and `/api/` directories
- Points to sitemap.xml

### 4. Sitemap (`public/sitemap.xml`)

- Single entry for root page
- Last modified date tracking
- Priority and change frequency hints

## Meta Tags Added

### Basic Meta Tags

```html
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=5"
/>
<meta name="theme-color" content="#ffffff" />
<meta name="description" content="..." />
<meta name="keywords" content="..." />
```

### PWA/Mobile

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>
<meta name="apple-mobile-web-app-title" content="Pomodoro" />
<meta name="mobile-web-app-capable" content="yes" />
<link rel="manifest" href="/site.webmanifest" />
```

### Social Media (Open Graph & Twitter)

```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:type" content="website" />
<meta property="og:image" content="/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="/og-image.png" />
```

### Search Engines

```html
<meta name="robots" content="index, follow" />
<meta name="googlebot" content="index, follow" />
```

## SEO Features

✅ **Semantic HTML**: Proper structure with Next.js metadata API
✅ **Mobile-First**: Responsive design with viewport settings
✅ **Open Graph**: Social sharing optimized
✅ **PWA Ready**: Installable on mobile and desktop
✅ **Robots.txt**: Search engine guidance
✅ **Sitemap**: XML sitemap for crawlers
✅ **Favicon**: Multiple sizes and formats
✅ **Performance**: No inline CSS, optimized delivery

## Required Image Assets

The following images should be added to `/public/` for full functionality:

### Favicon Files

- `favicon.ico` (32x32)
- `favicon-16x16.png`
- `favicon-32x32.png`

### Apple Touch Icon

- `apple-touch-icon.png` (180x180)

### Social Sharing

- `og-image.png` (1200x630)

### PWA App Icons

- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

### PWA Screenshots

- `screenshot-540x720.png` (narrow form factor)
- `screenshot-1280x720.png` (wide form factor)

## Future Enhancements

- [ ] Generate image assets automatically
- [ ] Add structured data (Schema.org JSON-LD)
- [ ] Implement dynamic sitemap generation
- [ ] Add Google Analytics integration
- [ ] Add Sentry error tracking
- [ ] Add performance monitoring

## References

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Web App Manifest Spec](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Tags](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup)
