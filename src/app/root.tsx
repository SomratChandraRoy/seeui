import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import type { ReactNode } from "react";
import "./global.css";

// ─── SEO Meta ──────────────────────────────────────────────────────────────────
const SITE_URL = "https://seeui.bipul.tech";
const SITE_TITLE = "SeeUI | Live UI Color Tester & Typography Playground";
const SITE_DESCRIPTION =
  "Stop guessing CSS. Test website background colors, text contrast, and typography instantly. Upload your logo, preview 40+ Google Fonts, check WCAG scores — zero-code UI tester for developers and designers.";
const SITE_KEYWORDS = [
  // Core Features & Tools
  "UI color tester",
  "color palette generator",
  "website color scheme tester",
  "typography preview tool",
  "CSS color playground",
  "logo color matcher",
  "background and text contrast checker",
  "hex color code extractor",
  "text color on background preview",
  "image upload color picker",
  "brand color palette generator",
  "web font previewer",
  // Developer & Vibe Coder Terms
  "front-end UI design tool",
  "CSS typography playground",
  "live CSS color preview",
  "zero-code UI tester",
  "Tailwind color palette generator",
  "developer color picking tool",
  "web design visualizer",
  "fast UI prototyping tool",
  "UI color palette tester",
  "real-time CSS color changer",
  // Problem-Solving Phrases
  "how to test website background colors",
  "check if text color looks good on background",
  "find matching colors for my logo",
  "website typography tester online",
  "preview fonts and colors together",
  "extract brand colors from logo image",
  "WCAG contrast checker with image upload",
  "fix bad website contrast online",
  "test website color combinations",
  "match background color to logo online",
  // Brand
  "SeeUI",
  "see UI",
  "seeui",
].join(", ");

export const meta = () => [
  { title: SITE_TITLE },
  { name: "description", content: SITE_DESCRIPTION },
  { name: "keywords", content: SITE_KEYWORDS },
  { name: "author", content: "SeeUI" },
  {
    name: "robots",
    content:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },
  { name: "theme-color", content: "#0F172A" },
  { name: "application-name", content: "SeeUI" },
  { name: "apple-mobile-web-app-title", content: "SeeUI" },
  { name: "apple-mobile-web-app-capable", content: "yes" },

  // Open Graph
  { property: "og:type", content: "website" },
  { property: "og:url", content: SITE_URL },
  { property: "og:title", content: SITE_TITLE },
  { property: "og:description", content: SITE_DESCRIPTION },
  { property: "og:image", content: `${SITE_URL}/og-image.png` },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  {
    property: "og:image:alt",
    content: "Developer using UI color tester to match brand logo",
  },
  { property: "og:site_name", content: "SeeUI" },
  { property: "og:locale", content: "en_US" },

  // Twitter Card
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: SITE_TITLE },
  { name: "twitter:description", content: SITE_DESCRIPTION },
  { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
  {
    name: "twitter:image:alt",
    content: "Developer using UI color tester to match brand logo",
  },
];

export const links = () => [
  { rel: "canonical", href: SITE_URL },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.png" },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/manifest.json" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
];

// ─── Error Boundary ────────────────────────────────────────────────────────────
export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0F172A",
        color: "#F8FAFC",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "2rem",
      }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div
          style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 900,
          }}>
          Oops!
        </div>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.75rem",
          }}>
          Something went wrong
        </h1>
        <p
          style={{
            color: "rgba(248,250,252,0.6)",
            lineHeight: 1.6,
            marginBottom: "1.5rem",
          }}>
          We hit an unexpected error. Please refresh the page or try again
          later.
        </p>
        <button
          onClick={() => window.location.reload()}
          type="button"
          style={{
            padding: "0.75rem 2rem",
            borderRadius: "9999px",
            border: "none",
            background: "linear-gradient(135deg, #60A5FA, #818CF8)",
            color: "#FFF",
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(96,165,250,0.3)",
          }}>
          Refresh Page
        </button>
      </div>
    </div>
  );
}

// ─── Root Layout ───────────────────────────────────────────────────────────────
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return <Outlet />;
}
