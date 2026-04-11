# APTITUDE Color System Guide

## Overview

This document explains how to apply page-specific color remixes across the APTITUDE site. Each page uses the same color palette but in different proportions to create cohesion while maintaining visual distinctness.

## Page-Specific Color Schemes

Add the appropriate `body_class` to each page's front matter to apply color themes:

### 1. Bias Beacon Pages
**Front Matter:**
```yaml
body_class: page-bias-beacon
```
**Primary Color:** Bright Blue (#4a7ec8)  
**Secondary Color:** Periwinkle (#a2addc)  
**Accent Color:** Rose (#c17795)  
**Best For:** Judicial analysis and bias-focused content

### 2. Judiciary Pages
**Front Matter:**
```yaml
body_class: page-judiciary
```
**Primary Color:** Deep Blue (#2d4a7b)  
**Secondary Color:** Sage (#7a9b7f)  
**Accent Color:** Gold (#d4af8f)  
**Best For:** Judge profiles and court data

### 3. Prosecutor Pages
**Front Matter:**
```yaml
body_class: page-prosecutor
```
**Primary Color:** Gold (#d4af8f)  
**Secondary Color:** Bronze (#a87a5c)  
**Accent Color:** Slate (#6b7280)  
**Best For:** Prosecution data and office profiles

### 4. Law Enforcement Pages
**Front Matter:**
```yaml
body_class: page-law-enforcement
```
**Primary Color:** Coral (#d97c6a)  
**Secondary Color:** Teal (#5d9b9b)  
**Accent Color:** Plum (#8b6f9f)  
**Best For:** Police activity and stops data

### 5. Community Corrections Pages
**Front Matter:**
```yaml
body_class: page-community-corrections
```
**Primary Color:** Seafoam (#7cb8a8)  
**Secondary Color:** Teal (#5d9b9b)  
**Accent Color:** Blue (#4a7ec8)  
**Best For:** Supervision and re-entry data

### 6. Juris Lab Pages
**Front Matter:**
```yaml
body_class: page-juris-lab
```
**Primary Color:** Sage (#7a9b7f)  
**Secondary Color:** Plum (#8b6f9f)  
**Accent Color:** Rose (#c17795)  
**Best For:** Research and analysis content

## Dynamic Text Effects

### Available Text Animation Classes

#### 1. Fade-In Animation
```html
<h2 class="text-dynamic">Your Heading Here</h2>
```
Creates a smooth fade-in effect on page load.

#### 2. Shimmer Effect
```html
<h2 class="text-shimmer">Your Heading Here</h2>
```
Creates a flowing shimmer animation across text using the page's primary and accent colors.

#### 3. Glow Effect
```html
<p class="text-glow">Your text here</p>
```
Creates a subtle pulsing glow effect.

## Color Variables Reference

All colors are accessible via CSS custom properties:

```css
/* Brand Colors */
--primary-deep: #1a2847;      /* Deep navy */
--primary-mid: #2d4a7b;       /* Mid blue */
--primary-light: #4a7ec8;     /* Light blue */

/* Accent Colors */
--accent-rose: #c17795;       /* Warm rose */
--accent-sage: #7a9b7f;       /* Soft sage */
--accent-gold: #d4af8f;       /* Warm gold */
--accent-slate: #6b7280;      /* Neutral slate */

/* Extended Palette */
--color-periwinkle: #a2addc;  /* Soft purple */
--color-teal: #5d9b9b;        /* Teal */
--color-coral: #d97c6a;       /* Warm coral */
--color-plum: #8b6f9f;        /* Soft plum */
--color-bronze: #a87a5c;      /* Bronze */
--color-seafoam: #7cb8a8;     /* Seafoam */

/* Page-Specific Variables */
--page-primary: [varies by page]
--page-accent: [varies by page]
--page-accent-2: [varies by page]
--page-bg-light: [varies by page]
--page-bg-medium: [varies by page]
```

## Implementation Examples

### Example 1: Judiciary Page with Dynamic Heading

```markdown
---
layout: page
title: Oregon's Sitting Judges
body_class: page-judiciary
---

<h2 class="text-dynamic">Circuit Court Judges by County</h2>
```

### Example 2: Prosecutor Page with Shimmer Title

```markdown
---
layout: page
title: Prosecution Analysis
body_class: page-prosecutor
---

<h2 class="text-shimmer">County Prosecutor Offices</h2>
```

### Example 3: Bias Beacon with Multiple Effect Levels

```html
<section class="page-bias-beacon">
  <h1 class="text-shimmer">Judicial Bias Patterns</h1>
  <p class="text-dynamic">Understand sentencing disparities across Oregon's judiciary.</p>
</section>
```

## Contrast & Accessibility

All color combinations meet or exceed WCAG AA contrast standards:

- **Dark text on light backgrounds:** ✓ 7:1 contrast ratio
- **Light text on dark backgrounds:** ✓ 7:1 contrast ratio
- **Interactive elements:** ✓ 4.5:1 contrast ratio minimum

## Customization

To create new page color schemes:

1. Open `assets/css/color-system.scss`
2. Add a new body class under "PAGE-SPECIFIC COLOR REMIXES"
3. Define `--page-primary`, `--page-accent`, `--page-accent-2`, and background variables
4. Add corresponding `.card-*` styles for flip cards if needed
5. Update this guide with new page information

## Browser Support

- CSS Custom Properties: All modern browsers
- CSS Grid & Flexbox: All modern browsers
- CSS Animations: All modern browsers (gracefully degraded in older browsers)
- Backdrop Filter: Chrome 76+, Safari 9+, Edge 79+

For older browser support, add fallback colors before custom property declarations.
