# ERP Management System — UI Design Guide

> **Theme:** Modern Glass ERP  
> **Version:** 1.0.0  
> **Phase:** 0 — Planning & Design  
> **Compatible With:** Shadcn UI + Tailwind CSS  
> **Last Updated:** 2026-07-07

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Spacing System](#4-spacing-system)
5. [Border Radius Rules](#5-border-radius-rules)
6. [Elevation & Shadows](#6-elevation--shadows)
7. [Glass Morphism System](#7-glass-morphism-system)
8. [Card Design](#8-card-design)
9. [Button Design](#9-button-design)
10. [Input & Form Design](#10-input--form-design)
11. [Table Design](#11-table-design)
12. [Dashboard Layout](#12-dashboard-layout)
13. [Sidebar & Navigation](#13-sidebar--navigation)
14. [Animation & Motion](#14-animation--motion)
15. [Responsive Breakpoints](#15-responsive-breakpoints)
16. [Iconography](#16-iconography)

---

## 1. Design Philosophy

The **Modern Glass ERP** design system is built on three core principles:

| Principle          | Implementation                                                         |
|--------------------|------------------------------------------------------------------------|
| **Clarity**        | Data is the hero. UI chrome is minimal to keep focus on content.       |
| **Depth**          | Layered surfaces using glassmorphism create spatial hierarchy.          |
| **Professionalism**| Dark, cool-toned palette with precise spacing signals enterprise trust. |

### Design Inspirations
- Linear.app (clean dark SaaS)
- Vercel Dashboard (monochromatic professional)
- Notion (information density without clutter)
- Figma (toolbars, sidebars, command palettes)

---

## 2. Color Palette

### 2.1 Base / Background Colors

| Token                   | Hex Value   | Usage                                        |
|-------------------------|-------------|----------------------------------------------|
| `--bg-base`             | `#080C14`   | Page/app root background                     |
| `--bg-surface-100`      | `#0D1117`   | Main content area background                 |
| `--bg-surface-200`      | `#111827`   | Sidebar, panels, secondary surfaces          |
| `--bg-surface-300`      | `#1A2235`   | Card backgrounds, elevated containers         |
| `--bg-surface-400`      | `#1E2A3A`   | Hover states on cards, modal backgrounds     |

### 2.2 Glass Layer Colors

| Token                   | Value (RGBA)               | Usage                                  |
|-------------------------|----------------------------|----------------------------------------|
| `--glass-bg`            | `rgba(255, 255, 255, 0.05)`| Base glass card background             |
| `--glass-bg-hover`      | `rgba(255, 255, 255, 0.08)`| Glass card hover state                 |
| `--glass-border`        | `rgba(255, 255, 255, 0.10)`| Glass card border                      |
| `--glass-border-hover`  | `rgba(255, 255, 255, 0.18)`| Glass card border on hover             |

### 2.3 Primary Brand Colors

| Token                   | Hex Value   | Usage                                        |
|-------------------------|-------------|----------------------------------------------|
| `--primary-400`         | `#60A5FA`   | Light primary — links, icons                 |
| `--primary-500`         | `#3B82F6`   | Main primary — primary buttons, active nav   |
| `--primary-600`         | `#2563EB`   | Darker primary — button hover                |
| `--primary-700`         | `#1D4ED8`   | Pressed/active button state                  |
| `--primary-glow`        | `rgba(59, 130, 246, 0.2)` | Glow effect behind primary elements |

### 2.4 Semantic / Status Colors

| Token                   | Hex Value   | Usage                                        |
|-------------------------|-------------|----------------------------------------------|
| `--success-400`         | `#34D399`   | Success states, positive values              |
| `--success-500`         | `#10B981`   | Success badges, stock in-range indicators    |
| `--warning-400`         | `#FBBF24`   | Warning states, low stock                    |
| `--warning-500`         | `#F59E0B`   | Warning badges, pending status               |
| `--danger-400`          | `#F87171`   | Error messages, delete confirmations          |
| `--danger-500`          | `#EF4444`   | Destructive actions, out-of-stock            |
| `--info-400`            | `#38BDF8`   | Informational callouts, tooltips             |

### 2.5 Text Colors

| Token                   | Hex Value   | Usage                                        |
|-------------------------|-------------|----------------------------------------------|
| `--text-primary`        | `#F1F5F9`   | Headings, primary labels                     |
| `--text-secondary`      | `#94A3B8`   | Body text, descriptions                      |
| `--text-tertiary`       | `#64748B`   | Placeholders, disabled text, captions        |
| `--text-muted`          | `#475569`   | Very subtle labels, dividers label text      |
| `--text-inverse`        | `#0F172A`   | Text on light backgrounds (e.g., light btn) |

### 2.6 Border Colors

| Token                   | Hex Value / RGBA             | Usage                             |
|-------------------------|------------------------------|-----------------------------------|
| `--border-subtle`       | `rgba(255, 255, 255, 0.06)`  | Dividers, subtle separators       |
| `--border-default`      | `rgba(255, 255, 255, 0.10)`  | Card borders, input borders       |
| `--border-strong`       | `rgba(255, 255, 255, 0.18)`  | Focused inputs, active elements   |

---

## 3. Typography

### 3.1 Font Selection

| Font Family      | Source         | Role              | Reason                                         |
|------------------|----------------|-------------------|------------------------------------------------|
| **Inter**        | Google Fonts   | Primary UI font   | Best-in-class legibility for data-dense UIs    |
| **JetBrains Mono** | Google Fonts | Code / data values | Tabular numbers, SKUs, IDs, monetary amounts  |

**Import:** Include in `index.html` or `index.css` via Google Fonts:
```
Inter: weights 300, 400, 500, 600, 700
JetBrains Mono: weights 400, 500
```

### 3.2 Type Scale

| Token          | Size   | Weight | Line Height | Usage                                      |
|----------------|--------|--------|-------------|---------------------------------------------|
| `text-hero`    | 36px   | 700    | 1.2         | Landing or empty state headlines            |
| `text-h1`      | 28px   | 700    | 1.25        | Page titles                                 |
| `text-h2`      | 22px   | 600    | 1.3         | Section headings                            |
| `text-h3`      | 18px   | 600    | 1.4         | Card headings, modal titles                 |
| `text-h4`      | 16px   | 600    | 1.4         | Sub-section labels                          |
| `text-body-lg` | 16px   | 400    | 1.6         | Body text, descriptions                     |
| `text-body`    | 14px   | 400    | 1.6         | Default body text, table cells              |
| `text-body-sm` | 13px   | 400    | 1.5         | Meta text, timestamps, supporting info      |
| `text-caption` | 12px   | 400    | 1.4         | Labels, badges, footnotes                   |
| `text-mono`    | 13px   | 400    | 1.5         | SKU, UUID, monetary values, code            |
| `text-mono-lg` | 24px   | 500    | 1.2         | KPI values on dashboard cards               |

### 3.3 Typography Rules

- **Hierarchy:** Never skip a heading level. Use consistent scale across all pages.
- **Line width:** Body text should not exceed 72 characters per line (max-width on paragraphs).
- **Monetary values:** Always use `font-family: JetBrains Mono` for prices, quantities, IDs — enables perfect column alignment.
- **Contrast:** All text must meet WCAG AA minimum 4.5:1 contrast ratio against its background.

---

## 4. Spacing System

Uses an **8px base grid**. All spacing values are multiples of 4px for fine-grained control.

| Token      | Value  | Common Usage                                        |
|------------|--------|-----------------------------------------------------|
| `space-1`  | 4px    | Micro spacing — icon gaps, tight label padding      |
| `space-2`  | 8px    | Small spacing — button icon gap, input inner padding|
| `space-3`  | 12px   | Default inline element gap                          |
| `space-4`  | 16px   | Standard padding — card inner, list items           |
| `space-5`  | 20px   | Comfortable padding                                 |
| `space-6`  | 24px   | Section padding, card-to-card gap                   |
| `space-8`  | 32px   | Page section spacing                                |
| `space-10` | 40px   | Large gaps between major layout regions             |
| `space-12` | 48px   | Page content top padding                            |
| `space-16` | 64px   | Hero section padding, large modal padding           |

### Component-Specific Spacing

| Component             | Padding                | Gap Between Items  |
|-----------------------|------------------------|--------------------|
| Page content area     | 24px (sides), 32px (top)| —                 |
| Card                  | 20px                   | —                  |
| KPI Card              | 24px                   | —                  |
| Button (default)      | 8px top/bottom, 16px sides | —              |
| Button (small)        | 6px top/bottom, 12px sides | —              |
| Table cell            | 12px top/bottom, 16px sides | —             |
| Table header          | 10px top/bottom, 16px sides | —             |
| Form field group      | —                      | 16px               |
| KPI card row          | —                      | 16px               |
| Sidebar nav items     | 8px top/bottom, 12px sides | 4px            |

---

## 5. Border Radius Rules

| Token          | Value | Usage                                               |
|----------------|-------|-----------------------------------------------------|
| `radius-sm`    | 6px   | Input fields, tags, small badges                    |
| `radius-md`    | 8px   | Default buttons, small cards, dropdowns             |
| `radius-lg`    | 12px  | Main cards, panels, modals                          |
| `radius-xl`    | 16px  | Large modals, feature cards, hero blocks            |
| `radius-2xl`   | 24px  | Dashboard KPI cards, large callout panels           |
| `radius-full`  | 9999px| Pills, avatar circles, toggle switches, status dots |

**Rule:** Nested elements should have a border-radius that is `parent_radius - parent_padding` (the "inset radius" rule). This ensures inner elements feel contained and proportional.

---

## 6. Elevation & Shadows

Shadows on a dark UI must be subtle and use dark-tinted values (not pure black).

| Level       | Shadow Value                                                   | Usage                           |
|-------------|----------------------------------------------------------------|---------------------------------|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.4)`                                    | Subtle lift — tags, small chips |
| `shadow-sm` | `0 2px 8px rgba(0,0,0,0.4)`                                    | Buttons, inputs on focus        |
| `shadow-md` | `0 4px 16px rgba(0,0,0,0.5)`                                   | Default cards                   |
| `shadow-lg` | `0 8px 32px rgba(0,0,0,0.6)`                                   | Modals, dropdowns, popovers     |
| `shadow-xl` | `0 16px 48px rgba(0,0,0,0.7)`                                  | Floating command palette        |
| `glow-primary` | `0 0 20px rgba(59, 130, 246, 0.25)`                         | Primary button hover            |
| `glow-success` | `0 0 16px rgba(16, 185, 129, 0.2)`                          | Success badge, in-stock status  |
| `glow-danger`  | `0 0 16px rgba(239, 68, 68, 0.2)`                           | Error state, destructive hover  |

---

## 7. Glass Morphism System

The signature visual style of the design system.

### Core Glass Recipe

```
background: rgba(255, 255, 255, 0.05)
backdrop-filter: blur(12px) saturate(180%)
-webkit-backdrop-filter: blur(12px) saturate(180%)
border: 1px solid rgba(255, 255, 255, 0.10)
```

### Glass Variants

| Variant         | Background Alpha | Blur   | Border Alpha | Usage                            |
|-----------------|------------------|--------|--------------|----------------------------------|
| `glass-subtle`  | 0.03             | 8px    | 0.06         | Sidebar items, secondary panels  |
| `glass-default` | 0.05             | 12px   | 0.10         | Standard cards, containers       |
| `glass-medium`  | 0.08             | 16px   | 0.14         | Modal backgrounds, tooltips      |
| `glass-strong`  | 0.12             | 20px   | 0.20         | Focused/active elements          |

### Usage Rules
1. **Layering:** Glass effects only look correct when placed over a rich background (gradient, image, or colored surface). Never use glass on a white/flat background.
2. **Performance:** Limit `backdrop-filter` to visible elements only. Use `will-change: transform` on animated glass elements sparingly.
3. **Contrast:** Ensure text placed on glass surfaces still meets WCAG contrast minimums. Test at each opacity level.
4. **Fallback:** Provide a non-glass fallback for browsers/devices that do not support `backdrop-filter`.

---

## 8. Card Design

### KPI Dashboard Card

```
Anatomy:
┌────────────────────────────────────────────┐
│  [Icon]  Label                   [Trend ↑] │
│                                            │
│  [KPI Value — large mono font]             │
│                                            │
│  [Subtitle / comparison text]              │
└────────────────────────────────────────────┘

Styling:
- Background: glass-default
- Border: 1px solid var(--glass-border)
- Border-radius: radius-2xl (24px)
- Padding: 24px
- Shadow: shadow-md
- Icon: 40x40px, colored circle background with 10% opacity
- KPI Value: text-mono-lg (24px, 500 weight)
- Hover: glass-medium + glow-primary (subtle)
- Transition: all 200ms ease
```

### Data / Feature Card

```
Anatomy:
┌─────────────────────────────────────────────┐
│  Card Header: Title           [Action Btn]  │
├─────────────────────────────────────────────┤
│                                             │
│  Card Content (table, form, list, etc.)     │
│                                             │
└─────────────────────────────────────────────┘

Styling:
- Background: glass-default
- Border: 1px solid var(--border-default)
- Border-radius: radius-lg (12px)
- Header padding: 16px 20px
- Content padding: 0 (table touches edges) or 20px (form/list)
- Header bottom border: 1px solid var(--border-subtle)
```

### Empty State Card

```
Anatomy (centered):
┌────────────────────────────────────────────┐
│                                            │
│            [Illustration Icon]             │
│                                            │
│         No [Entity] Found                  │
│  Add your first [entity] to get started.   │
│                                            │
│            [Primary CTA Button]            │
│                                            │
└────────────────────────────────────────────┘

Styling:
- Dashed border: 1px dashed var(--border-default)
- Background: transparent
- Border-radius: radius-lg
- Padding: 48px
- Icon: 64px, text-tertiary color
- Title: text-h3, text-secondary
- Body: text-body, text-tertiary
```

---

## 9. Button Design

### Primary Button

```
Styling:
- Background: linear-gradient(135deg, #3B82F6, #2563EB)
- Text: #FFFFFF, 14px, 500 weight
- Padding: 8px 16px
- Border-radius: radius-md (8px)
- Border: none
- Box-shadow: glow-primary (on hover)
- Hover: brightness(110%), shadow increases
- Active: brightness(95%), scale(0.98)
- Disabled: opacity 0.5, cursor not-allowed
- Transition: all 150ms ease
```

### Secondary / Outline Button

```
Styling:
- Background: transparent
- Border: 1px solid var(--border-default)
- Text: var(--text-secondary), 14px, 500 weight
- Padding: 8px 16px
- Border-radius: radius-md
- Hover: background glass-subtle, border var(--border-strong), text var(--text-primary)
- Transition: all 150ms ease
```

### Destructive Button

```
Styling:
- Background: rgba(239, 68, 68, 0.15)
- Border: 1px solid rgba(239, 68, 68, 0.3)
- Text: var(--danger-400), 14px, 500 weight
- Hover: background rgba(239, 68, 68, 0.25), glow-danger
```

### Ghost / Icon Button

```
Styling:
- Background: transparent
- Border: none
- Text: var(--text-tertiary)
- Padding: 8px
- Border-radius: radius-md
- Hover: background glass-subtle, text var(--text-primary)
```

### Button Sizes

| Size     | Height | Padding         | Font Size | Icon Size |
|----------|--------|-----------------|-----------|-----------|
| `xs`     | 28px   | 4px 10px        | 12px      | 14px      |
| `sm`     | 32px   | 6px 12px        | 13px      | 14px      |
| `md`     | 36px   | 8px 16px        | 14px      | 16px      |
| `lg`     | 40px   | 10px 20px       | 15px      | 18px      |
| `xl`     | 48px   | 12px 24px       | 16px      | 20px      |

---

## 10. Input & Form Design

### Text Input

```
Styling:
- Background: rgba(255, 255, 255, 0.04)
- Border: 1px solid var(--border-default)
- Text: var(--text-primary), 14px
- Placeholder: var(--text-tertiary)
- Padding: 8px 12px
- Border-radius: radius-sm (6px)
- Height: 36px (default)

States:
- Focus: border var(--border-strong) (blue tint), box-shadow glow-primary (subtle)
- Error: border var(--danger-500), background rgba(239,68,68,0.05)
- Disabled: opacity 0.5, cursor not-allowed, no hover effect
- Read-only: background slightly different, no focus ring

Transition: border-color 150ms ease, box-shadow 150ms ease
```

### Form Label

```
- Font: 13px, 500 weight
- Color: var(--text-secondary)
- Margin-bottom: 6px
- Required indicator: var(--danger-400) asterisk (*) after label text
```

### Form Error Message

```
- Font: 12px, 400 weight
- Color: var(--danger-400)
- Margin-top: 4px
- Icon: small error icon (⚠) before message text
```

### Form Layout

```
- Single column for simple forms (max-width 480px)
- Two-column grid for complex entity forms (e.g., customer, supplier)
- Section dividers between logical field groups
- Action buttons (Submit, Cancel) at bottom-right, right-aligned
- Cancel = secondary button, Submit = primary button
- Minimum 32px gap between Cancel and Submit
```

### Select / Dropdown

```
- Matches text input styling
- Chevron icon right-aligned inside input
- Dropdown panel: glass-medium background, shadow-lg
- Option hover: glass-subtle background
- Selected option: primary color text, check icon right-aligned
```

### Search Input

```
- Search icon (magnifying glass) left-aligned inside input
- Clear button (×) appears when text is present, right-aligned
- Debounce: 300ms before triggering search request
```

---

## 11. Table Design

### Table Container

```
- Background: transparent (inherits card background)
- Overflow-x: auto (horizontal scroll on small screens)
- Border-radius: matches card (inherit from card wrapper)
```

### Table Header Row

```
- Background: rgba(255, 255, 255, 0.03)
- Text: 12px, 600 weight, uppercase, letter-spacing 0.05em
- Color: var(--text-tertiary)
- Padding: 10px 16px
- Border-bottom: 1px solid var(--border-subtle)
- Position: sticky top (for long tables with scroll)
- Sortable columns: show sort icon on hover, active sort shown in primary color
```

### Table Body Row

```
- Background: transparent
- Text: 14px, 400 weight, var(--text-primary)
- Padding: 12px 16px
- Border-bottom: 1px solid var(--border-subtle)
- Hover: background rgba(255, 255, 255, 0.03)
- Transition: background 100ms ease

Selected row:
- Background: rgba(59, 130, 246, 0.08)
- Left border: 2px solid var(--primary-500)
```

### Table Cell Types

| Cell Type    | Styling                                                         |
|--------------|-----------------------------------------------------------------|
| Text         | var(--text-primary), 14px                                       |
| ID / SKU     | var(--text-tertiary), 13px, JetBrains Mono                     |
| Monetary     | var(--text-primary), 14px, JetBrains Mono, right-aligned       |
| Number       | var(--text-primary), 14px, JetBrains Mono, right-aligned       |
| Date         | var(--text-secondary), 13px                                     |
| Status Badge | Pill badge with color based on status (see badges below)        |
| Actions      | Ghost icon buttons, right-aligned, visible on row hover         |

### Status Badges

| Status      | Background              | Text Color        | Border              |
|-------------|-------------------------|-------------------|---------------------|
| completed   | rgba(16,185,129,0.15)   | var(--success-400)| success-500 @ 30%   |
| pending     | rgba(245,158,11,0.15)   | var(--warning-400)| warning-500 @ 30%   |
| cancelled   | rgba(239,68,68,0.15)    | var(--danger-400) | danger-500 @ 30%    |
| active      | rgba(59,130,246,0.15)   | var(--primary-400)| primary-500 @ 30%   |
| inactive    | rgba(100,116,139,0.15)  | var(--text-tertiary)| muted @ 30%       |

### Table Pagination

```
- Positioned below table, right-aligned
- Shows: "Showing X–Y of Z results"
- Previous / Next buttons (ghost style)
- Page number pills
- Rows per page selector (10, 25, 50, 100)
```

---

## 12. Dashboard Layout

### Overall Layout Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  SIDEBAR (260px fixed)  │  MAIN CONTENT AREA (flex-grow)         │
│                         │                                        │
│  [Logo]                 │  ┌─ PAGE HEADER ─────────────────────┐ │
│  [Nav Items]            │  │ Page Title    [Breadcrumb]         │ │
│                         │  └───────────────────────────────────┘ │
│  [User Profile]         │                                        │
│                         │  ┌─ KPI CARDS ROW ────────────────── ┐ │
│                         │  │ [Card][Card][Card][Card][Card][Crd]│ │
│                         │  └────────────────────────────────────┘ │
│                         │                                        │
│                         │  ┌─ CONTENT SECTION ─────────────────┐ │
│                         │  │ [Table / Charts / Forms]           │ │
│                         │  └───────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### KPI Cards Grid

```
Dashboard KPI row:
- Desktop: 3 or 6 cards in a single row (CSS Grid, repeat(3, 1fr) or repeat(6, 1fr))
- Tablet: 2 columns
- Mobile: 1 column (stacked)
- Gap: 16px between cards
```

### KPI Card Content

```
Each card displays:
1. Icon (top-left, in colored pill)
2. Label ("Total Products", "Revenue", etc.)
3. KPI Value (large, prominent)
4. Trend indicator (% change vs last period) — optional Phase 2
5. Sparkline chart — optional Phase 2
```

---

## 13. Sidebar & Navigation

### Sidebar Specifications

```
Width: 260px (desktop), collapsible to 72px (icon-only mode)
Background: var(--bg-surface-200) with glass-subtle overlay
Border-right: 1px solid var(--border-subtle)
Position: fixed, full height
Z-index: 50
```

### Sidebar Structure

```
┌────────────────────────────┐
│  [Logo Icon] ERP System    │  ← 64px header
├────────────────────────────┤
│                            │
│  OVERVIEW                  │  ← Section label (caps, muted, 11px)
│  ○ Dashboard               │
│                            │
│  MANAGEMENT                │
│  ○ Products                │
│  ○ Customers               │
│  ○ Suppliers               │
│                            │
│  TRANSACTIONS              │
│  ○ Purchases               │
│  ○ Sales                   │
│                            │
│  ANALYTICS                 │
│  ○ Reports                 │
│                            │
├────────────────────────────┤
│  [Avatar] User Name        │  ← User profile, bottom
│           user@email.com   │
│                    [↓]     │  ← Logout / settings dropdown
└────────────────────────────┘
```

### Nav Item States

| State    | Background              | Text Color          | Icon Color          | Left Accent |
|----------|-------------------------|---------------------|---------------------|-------------|
| Default  | transparent             | var(--text-secondary)| var(--text-tertiary)| none       |
| Hover    | glass-subtle            | var(--text-primary) | var(--text-secondary)| none      |
| Active   | rgba(59,130,246,0.12)   | var(--primary-400)  | var(--primary-400)  | 2px solid primary-500 |

### Nav Item Anatomy

```
[16px gap][Icon 18px][8px gap][Label text 14px][auto][Badge? (optional)]
```

---

## 14. Animation & Motion

### Motion Principles

- **Purposeful:** Every animation must serve a function (feedback, navigation, attention).
- **Subtle:** Prefer 100–300ms durations. Longer animations feel sluggish in data apps.
- **Easing:** Use `ease-out` for elements entering the screen, `ease-in` for exiting.

### Standard Transitions

| Element             | Property           | Duration | Easing     |
|---------------------|--------------------|----------|------------|
| Button hover        | background, shadow | 150ms    | ease       |
| Nav item hover      | background, color  | 100ms    | ease       |
| Card hover          | background, border | 200ms    | ease       |
| Input focus         | border, shadow     | 150ms    | ease       |
| Dropdown open       | opacity, transform | 150ms    | ease-out   |
| Modal open          | opacity, scale     | 200ms    | ease-out   |
| Modal close         | opacity, scale     | 150ms    | ease-in    |
| Toast notification  | translate, opacity | 250ms    | ease-out   |
| Page transition     | opacity            | 200ms    | ease       |
| Table row hover     | background         | 100ms    | ease       |
| Skeleton shimmer    | background-position| 1.5s     | linear ∞  |

### Skeleton Loading

- Use animated shimmer gradient on card/table placeholders during data loading.
- Shimmer direction: left-to-right.
- Shimmer colors: `#1A2235` → `#243045` → `#1A2235`.

### Page Enter Animation

```
New page content:
- Initial state: opacity 0, translateY 8px
- Final state: opacity 1, translateY 0
- Duration: 200ms, ease-out
- Stagger delay for grid items: 30ms per item
```

---

## 15. Responsive Breakpoints

| Token     | Breakpoint | Description                     |
|-----------|------------|---------------------------------|
| `xs`      | < 480px    | Small mobile                    |
| `sm`      | ≥ 480px    | Mobile                          |
| `md`      | ≥ 768px    | Tablet                          |
| `lg`      | ≥ 1024px   | Desktop (laptop)                |
| `xl`      | ≥ 1280px   | Large desktop                   |
| `2xl`     | ≥ 1536px   | Wide desktop                    |

### Layout Adaptations

| Component          | Mobile (< 768px)                | Desktop (≥ 1024px)              |
|--------------------|---------------------------------|---------------------------------|
| Sidebar            | Hidden (hamburger menu → drawer)| Fixed, always visible           |
| KPI Cards          | 1 column                        | 3 or 6 column grid              |
| Data Tables        | Horizontal scroll inside card   | Full width display              |
| Forms              | Single column                   | Two-column grid (where sensible)|
| Page content gap   | 16px                            | 24px                            |
| Page content padding | 16px sides                    | 24–32px sides                   |

---

## 16. Iconography

### Icon Library
**Lucide React** — chosen for its clean, consistent stroke-based icons that align with the minimalist design system.

### Usage Rules

| Context                  | Icon Size | Stroke Width |
|--------------------------|-----------|--------------|
| Sidebar navigation icons | 18px      | 1.5px        |
| Button icons             | 16px      | 1.5px        |
| KPI card icons           | 20px      | 1.5px        |
| Table action icons       | 16px      | 1.5px        |
| Empty state illustrations| 48–64px   | 1.5px        |
| Toast / Alert icons      | 16px      | 2px          |
| Form field prefix icons  | 16px      | 1.5px        |

### Recommended Icons Per Module

| Module          | Primary Icon    | Secondary Icons                    |
|-----------------|-----------------|------------------------------------|
| Dashboard       | `LayoutDashboard` | `TrendingUp`, `Activity`         |
| Products        | `Package`       | `Tag`, `BarChart2`, `Search`       |
| Customers       | `Users`         | `UserPlus`, `Mail`, `Phone`        |
| Suppliers       | `Truck`         | `Building2`, `Globe`               |
| Purchases       | `ShoppingCart`  | `Receipt`, `ArrowDownCircle`       |
| Sales           | `ShoppingBag`   | `FileText`, `ArrowUpCircle`        |
| Reports         | `BarChart3`     | `FileDown`, `Filter`               |
| Auth            | `Lock`          | `LogIn`, `LogOut`, `UserCheck`     |
