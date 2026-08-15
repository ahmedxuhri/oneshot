import json
from typing import Dict, Any

DEFAULT_THEMES = {
    "linear_dark": {
        "id": "linear_dark",
        "name": "Linear Dark / Midnight Glow",
        "badge": "Developer / Modern Dark",
        "badgeColor": "#00F2FE",
        "desc": "Deep obsidian surfaces, electric cyan CTAs, glass borders, high-contrast monospace accents.",
        "bgPreview": "#08090C",
        "cardPreview": "#151821",
        "primaryColor": "#00F2FE",
        "accentColor": "#10B981",
        "textColor": "#F8FAFC",
        "subTextColor": "#94A3B8",
        "borderColor": "rgba(255, 255, 255, 0.15)",
        "btnRadius": "6px",
        "bestFor": "Modern Web Apps, Developer Tools & SaaS",
        "colors": {
            "bg_page": "#08090C",
            "bg_surface": "#0F1117",
            "bg_card": "#151821",
            "text_primary": "#F8FAFC",
            "text_secondary": "#94A3B8",
            "accent_primary": "#00F2FE",
            "accent_secondary": "#38BDF8",
            "accent_success": "#10B981",
            "accent_danger": "#F43F5E",
            "border": "rgba(255, 255, 255, 0.12)"
        },
        "typography": {
            "font_family_sans": "Plus Jakarta Sans, Inter, system-ui, sans-serif",
            "font_family_mono": "JetBrains Mono, Fira Code, monospace",
            "scale": {
                "h1": "2.25rem (36px) / 700 / tracking -0.025em",
                "h2": "1.75rem (28px) / 700 / tracking -0.02em",
                "h3": "1.25rem (20px) / 600 / tracking -0.01em",
                "body": "0.9375rem (15px) / 400 / line-height 1.6",
                "caption": "0.8125rem (13px) / 500 / line-height 1.4"
            }
        },
        "radius": { "sm": "6px", "md": "10px", "lg": "16px", "pill": "9999px" },
        "shadows": {
            "card": "0 8px 24px rgba(0, 0, 0, 0.5)",
            "glow": "0 0 20px rgba(0, 242, 254, 0.25)"
        }
    },
    "material_you": {
        "id": "material_you",
        "name": "Material Design 3 / Android M3",
        "badge": "Android 15 Native",
        "badgeColor": "#A8C7FA",
        "desc": "Google Material You dynamic tonal palette, pill-shaped buttons, 48dp touch targets.",
        "bgPreview": "#111318",
        "cardPreview": "#282A2F",
        "primaryColor": "#A8C7FA",
        "accentColor": "#A8DAB5",
        "textColor": "#E2E2E9",
        "subTextColor": "#C4C6D0",
        "borderColor": "rgba(196, 198, 208, 0.22)",
        "btnRadius": "9999px",
        "bestFor": "Native Android (Jetpack Compose) & Mobile Apps",
        "colors": {
            "bg_page": "#111318",
            "bg_surface": "#1E2025",
            "bg_card": "#282A2F",
            "text_primary": "#E2E2E9",
            "text_secondary": "#C4C6D0",
            "accent_primary": "#A8C7FA",
            "accent_secondary": "#7C93C1",
            "accent_success": "#A8DAB5",
            "accent_danger": "#F2B8B5",
            "border": "rgba(196, 198, 208, 0.18)"
        },
        "typography": {
            "font_family_sans": "Roboto, Roboto Flex, system-ui, sans-serif",
            "font_family_mono": "Roboto Mono, monospace",
            "scale": {
                "h1": "2.0rem (32px) / 700 / Headline Large",
                "h2": "1.5rem (24px) / 600 / Headline Medium",
                "h3": "1.25rem (20px) / 600 / Title Large",
                "body": "0.875rem (14px) / 400 / Body Large",
                "caption": "0.75rem (12px) / 500 / Label Medium"
            }
        },
        "radius": { "sm": "8px", "md": "16px", "lg": "28px", "pill": "9999px" },
        "shadows": {
            "card": "0 2px 6px rgba(0, 0, 0, 0.35)",
            "glow": "none"
        }
    },
    "apple_hig": {
        "id": "apple_hig",
        "name": "Apple HIG / Clean Glass",
        "badge": "iOS / macOS Native",
        "badgeColor": "#0A84FF",
        "desc": "Cupertino frosted glassmorphism, SF Pro typography, refined hairline dividers.",
        "bgPreview": "#000000",
        "cardPreview": "#1C1C1E",
        "primaryColor": "#0A84FF",
        "accentColor": "#30D158",
        "textColor": "#FFFFFF",
        "subTextColor": "rgba(235, 235, 245, 0.6)",
        "borderColor": "rgba(255, 255, 255, 0.2)",
        "btnRadius": "10px",
        "bestFor": "iOS Native (SwiftUI) & Creative Utility Tools",
        "colors": {
            "bg_page": "#000000",
            "bg_surface": "rgba(28, 28, 30, 0.75)",
            "bg_card": "rgba(44, 44, 46, 0.85)",
            "text_primary": "#FFFFFF",
            "text_secondary": "#EBEBF599",
            "accent_primary": "#0A84FF",
            "accent_secondary": "#5E5CE6",
            "accent_success": "#30D158",
            "accent_danger": "#FF453A",
            "border": "rgba(255, 255, 255, 0.15)"
        },
        "typography": {
            "font_family_sans": "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif",
            "font_family_mono": "'SF Mono', Menlo, monospace",
            "scale": {
                "h1": "2.125rem (34px) / 700 / Large Title",
                "h2": "1.75rem (28px) / 700 / Title 1",
                "h3": "1.25rem (20px) / 600 / Title 2",
                "body": "1.0625rem (17px) / 400 / Body",
                "caption": "0.8125rem (13px) / 400 / Footnote"
            }
        },
        "radius": { "sm": "8px", "md": "12px", "lg": "20px", "pill": "9999px" },
        "shadows": {
            "card": "0 10px 30px rgba(0, 0, 0, 0.4)",
            "glow": "0 4px 20px rgba(10, 132, 255, 0.2)"
        }
    },
    "saas_clean_light": {
        "id": "saas_clean_light",
        "name": "Stripe / Clean Soft-SaaS",
        "badge": "Enterprise Light",
        "badgeColor": "#6366F1",
        "desc": "Crisp white cards, soft ambient drop shadows, indigo primary CTAs, high daylight legibility.",
        "bgPreview": "#F8FAFC",
        "cardPreview": "#FFFFFF",
        "primaryColor": "#6366F1",
        "accentColor": "#10B981",
        "textColor": "#0F172A",
        "subTextColor": "#64748B",
        "borderColor": "#E2E8F0",
        "btnRadius": "8px",
        "bestFor": "Admin Dashboards, B2B SaaS & Billing Portals",
        "colors": {
            "bg_page": "#F8FAFC",
            "bg_surface": "#FFFFFF",
            "bg_card": "#FFFFFF",
            "text_primary": "#0F172A",
            "text_secondary": "#64748B",
            "accent_primary": "#6366F1",
            "accent_secondary": "#4F46E5",
            "accent_success": "#10B981",
            "accent_danger": "#EF4444",
            "border": "#E2E8F0"
        },
        "typography": {
            "font_family_sans": "Inter, Plus Jakarta Sans, system-ui, sans-serif",
            "font_family_mono": "JetBrains Mono, monospace",
            "scale": {
                "h1": "2.25rem (36px) / 800 / tracking -0.025em",
                "h2": "1.75rem (28px) / 700 / tracking -0.02em",
                "h3": "1.25rem (20px) / 600 / tracking -0.01em",
                "body": "0.9375rem (15px) / 400 / line-height 1.6",
                "caption": "0.8125rem (13px) / 500 / line-height 1.4"
            }
        },
        "radius": { "sm": "6px", "md": "8px", "lg": "12px", "pill": "9999px" },
        "shadows": {
            "card": "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
            "glow": "0 4px 14px rgba(99, 102, 241, 0.18)"
        }
    },
    "tactical_mono": {
        "id": "tactical_mono",
        "name": "Tactical Monospace / FinTech",
        "badge": "Telemetry / Terminal",
        "badgeColor": "#F59E0B",
        "desc": "High-density telemetry, neon amber status indicators, compact 4px spacing, sharp edges.",
        "bgPreview": "#05070A",
        "cardPreview": "#131822",
        "primaryColor": "#F59E0B",
        "accentColor": "#10B981",
        "textColor": "#F0F6FC",
        "subTextColor": "#8B949E",
        "borderColor": "#30363D",
        "btnRadius": "3px",
        "bestFor": "Crypto Bots, IoT Telemetry & Trading Terminal UI",
        "colors": {
            "bg_page": "#05070A",
            "bg_surface": "#0C1017",
            "bg_card": "#131822",
            "text_primary": "#F0F6FC",
            "text_secondary": "#8B949E",
            "accent_primary": "#F59E0B",
            "accent_secondary": "#10B981",
            "accent_success": "#10B981",
            "accent_danger": "#F43F5E",
            "border": "#21262D"
        },
        "typography": {
            "font_family_sans": "JetBrains Mono, Fira Code, monospace",
            "font_family_mono": "JetBrains Mono, monospace",
            "scale": {
                "h1": "1.75rem (28px) / 700 / tracking -0.01em",
                "h2": "1.375rem (22px) / 700",
                "h3": "1.125rem (18px) / 600",
                "body": "0.875rem (14px) / 400 / line-height 1.5",
                "caption": "0.75rem (12px) / 500 / line-height 1.3"
            }
        },
        "radius": { "sm": "2px", "md": "4px", "lg": "6px", "pill": "4px" },
        "shadows": {
            "card": "none",
            "glow": "0 0 10px rgba(245, 158, 11, 0.25)"
        }
    }
}

THEMES = DEFAULT_THEMES

def resolve_theme(theme_input: Any) -> Dict[str, Any]:
    """
    Resolves a theme ID or custom dynamic theme object into a complete token dictionary.
    """
    if isinstance(theme_input, dict) and "name" in theme_input:
        # Custom dynamic theme from Bedrock
        c = theme_input.get("colors", {})
        bg_page = c.get("bg_page") or theme_input.get("bgPreview", "#0F1117")
        bg_card = c.get("bg_card") or theme_input.get("cardPreview", "#151821")
        primary = c.get("accent_primary") or theme_input.get("primaryColor", "#38BDF8")
        accent = c.get("accent_secondary") or theme_input.get("accentColor", "#10B981")
        text_pri = c.get("text_primary") or theme_input.get("textColor", "#F8FAFC")
        text_sec = c.get("text_secondary") or theme_input.get("subTextColor", "#94A3B8")
        border = c.get("border") or theme_input.get("borderColor", "rgba(255, 255, 255, 0.15)")
        btn_radius = theme_input.get("btnRadius", "8px")

        return {
            "id": theme_input.get("id", "custom_theme"),
            "name": theme_input.get("name", "Custom AI Design System"),
            "description": theme_input.get("desc") or theme_input.get("description", "AI tailored palette"),
            "badge": theme_input.get("badge", "AI Custom"),
            "badgeColor": primary,
            "colors": {
                "bg_page": bg_page,
                "bg_surface": bg_card,
                "bg_card": bg_card,
                "text_primary": text_pri,
                "text_secondary": text_sec,
                "accent_primary": primary,
                "accent_secondary": accent,
                "accent_success": "#10B981",
                "accent_danger": "#F43F5E",
                "border": border
            },
            "typography": {
                "font_family_sans": "Plus Jakarta Sans, Inter, system-ui, sans-serif",
                "font_family_mono": "JetBrains Mono, Fira Code, monospace",
                "scale": {
                    "h1": "2.25rem (36px) / 700 / tracking -0.025em",
                    "h2": "1.75rem (28px) / 700 / tracking -0.02em",
                    "h3": "1.25rem (20px) / 600 / tracking -0.01em",
                    "body": "0.9375rem (15px) / 400 / line-height 1.6",
                    "caption": "0.8125rem (13px) / 500 / line-height 1.4"
                }
            },
            "radius": { "sm": "4px", "md": btn_radius, "lg": "16px", "pill": "9999px" },
            "shadows": {
                "card": "0 8px 24px rgba(0, 0, 0, 0.4)",
                "glow": f"0 0 20px {primary}33"
            }
        }
    elif isinstance(theme_input, str) and theme_input in DEFAULT_THEMES:
        return DEFAULT_THEMES[theme_input]
    else:
        return DEFAULT_THEMES["linear_dark"]

def generate_design_md(theme_input: Any, app_name: str, pattern_category: str) -> str:
    """
    Generates a production-grade DESIGN.md following the Google Labs open specification.
    """
    theme = resolve_theme(theme_input)
    c = theme["colors"]
    t = theme["typography"]
    r = theme["radius"]
    s = theme["shadows"]

    yaml_frontmatter = f"""---
$schema: "https://specs.design.md/v1/schema.json"
version: "1.0.0"
theme: "{theme['id']}"
name: "{theme['name']}"
application: "{app_name}"
tokens:
  color:
    background:
      page: "{c['bg_page']}"
      surface: "{c['bg_surface']}"
      card: "{c['bg_card']}"
    text:
      primary: "{c['text_primary']}"
      secondary: "{c['text_secondary']}"
    accent:
      primary: "{c['accent_primary']}"
      secondary: "{c['accent_secondary']}"
      success: "{c['accent_success']}"
      danger: "{c['accent_danger']}"
    border:
      default: "{c['border']}"
  typography:
    family:
      sans: "{t['font_family_sans']}"
      mono: "{t['font_family_mono']}"
    scale:
      h1: "{t['scale']['h1']}"
      h2: "{t['scale']['h2']}"
      h3: "{t['scale']['h3']}"
      body: "{t['scale']['body']}"
      caption: "{t['scale']['caption']}"
  spacing:
    unit: 4
    grid: [4, 8, 12, 16, 24, 32, 48, 64]
  radius:
    sm: "{r['sm']}"
    md: "{r['md']}"
    lg: "{r['lg']}"
    pill: "{r['pill']}"
  shadow:
    card: "{s['card']}"
    glow: "{s['glow']}"
  touch_target:
    min_size_dp: 48
---"""

    markdown_body = f"""
# DESIGN.md — Visual & UX Specification for {app_name}

> Generated by OneShot Spec Engine based on the **{theme['name']}** design system.
> Source of truth for UI components, layout tokens, accessibility, and visual consistency.

---

## 1. Aesthetic Vision & Personality
- **Visual Vibe**: {theme['description']}
- **Primary Category**: {pattern_category.upper()}
- **Core Contrast Ratio**: WCAG 2.2 Level AA compliant (minimum 4.5:1 text-to-background contrast).

---

## 2. Color Palette & Roles

| Role | Token Name | Hex / Value | Usage Description |
|---|---|---|---|
| Page Background | `color.background.page` | `{c['bg_page']}` | App root background canvas |
| Surface Container | `color.background.surface` | `{c['bg_surface']}` | Sidebars, headers, modal overlays |
| Card Surface | `color.background.card` | `{c['bg_card']}` | List items, interactive cards, form groups |
| Primary Text | `color.text.primary` | `{c['text_primary']}` | Headings, active values, high emphasis copy |
| Secondary Text | `color.text.secondary` | `{c['text_secondary']}` | Labels, timestamps, subtle metadata |
| Primary Accent | `color.accent.primary` | `{c['accent_primary']}` | Primary CTA buttons, active tabs, focus rings |
| Secondary Accent | `color.accent.secondary` | `{c['accent_secondary']}` | Secondary badges, active filters, charts |
| Success State | `color.accent.success` | `{c['accent_success']}` | Synced status, confirmations, positive deltas |
| Danger State | `color.accent.danger` | `{c['accent_danger']}` | Deletions, validation errors, network offline |
| Border | `color.border.default` | `{c['border']}` | Card perimeters, dividers, input borders |

---

## 3. Typography Scale & Hierarchy

- **Sans-Serif Font**: `{t['font_family_sans']}`
- **Monospace Font**: `{t['font_family_mono']}`

```
H1 (Page Title):     {t['scale']['h1']}
H2 (Section Header): {t['scale']['h2']}
H3 (Card Title):     {t['scale']['h3']}
Body (Content):      {t['scale']['body']}
Caption / Metadata:  {t['scale']['caption']}
```

---

## 4. Component Anatomy & Interaction Rules

### Buttons & Touch Targets
- **Minimum Touch Target**: `48dp` x `48dp` (Android Material 3 & Apple HIG standard) for all mobile tap targets.
- **Primary Button**: Background `{c['accent_primary']}`, text `#000000` (or high contrast), radius `{r['md']}`, padding `12px 20px`.
- **Secondary Button**: Background `transparent`, border `1px solid {c['border']}`, text `{c['text_primary']}`.
- **Hover & Active States**: Scale transform `scale(0.98)` on active press with `0.15s ease-out` transition.

### Cards & Containers
- Border radius: `{r['lg']}` for main cards, `{r['md']}` for nested items.
- Border: `1px solid {c['border']}`.
- Padding: `16px` (mobile) / `24px` (desktop).

### Input Fields
- Background: `{c['bg_card']}` with `1px solid {c['border']}`.
- Focus State: Border color `{c['accent_primary']}` with subtle glow `{s['glow']}`.
- Error State: Border color `{c['accent_danger']}` with helper text in caption size.

---

## 5. Forbidden UI Clichés (Strict Anti-Patterns)
1. 🚫 **No Lavender/Purple Glow on Dark**: Do not use generic purple text fills or neon violet buttons on dark themes.
2. 🚫 **No Tiny Touch Targets**: Never make clickable icon buttons smaller than 48dp on mobile layouts.
3. 🚫 **No Low-Contrast Text**: Never use `#4B5563` or muted dark gray text on black backgrounds.
4. 🚫 **No Arbitrary Spacing**: Use only the 4px/8px spacing grid (`8px`, `16px`, `24px`, `32px`).
5. 🚫 **No Layout Shifts**: Always provide explicit aspect ratios or skeleton loaders for images and list feeds.
"""

    return yaml_frontmatter.strip() + "\n" + markdown_body.strip()
