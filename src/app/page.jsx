
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import ColorBoard from "../components/ColorBoard";
import TypographyBoard from "../components/TypographyBoard";
import FONTS, {
  DEFAULT_FONT,
  RANDOM_DEFAULTS,
  buildGoogleFontsUrl,
} from "../data/fonts";
import {
  getContrastColor,
  getMutedContrastColor,
} from "../utils/getContrastColor";

const GOOGLE_FONTS_HREF = buildGoogleFontsUrl();

function getLuminance(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255,
    g = parseInt(c.slice(2, 4), 16) / 255,
    b = parseInt(c.slice(4, 6), 16) / 255;
  const lin = (x) =>
    x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function getContrastRatio(hex) {
  return ((getLuminance(hex) + 0.05) / 0.05).toFixed(1);
}

export default function HomePage() {
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Random default bg on each load — initialiser runs once per client mount
  const [bgColor, setBgColor] = useState(
    () => RANDOM_DEFAULTS[Math.floor(Math.random() * RANDOM_DEFAULTS.length)],
  );
  const [textColor, setTextColor] = useState(() => getContrastColor(bgColor));
  const [textIsAuto, setTextIsAuto] = useState(true);

  // Typography state
  const [fontSlug, setFontSlug] = useState(DEFAULT_FONT.slug);
  const [fontWeight, setFontWeight] = useState(700);
  const [fontSize, setFontSize] = useState(56);

  const activeFont = useMemo(
    () => FONTS.find((f) => f.slug === fontSlug) || DEFAULT_FONT,
    [fontSlug],
  );
  const fontFamily = activeFont.family;

  // UI state
  const [copied, setCopied] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const logoInputRef = useRef(null);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleBgChange = useCallback(
    (hex) => {
      setBgColor(hex);
      if (textIsAuto) setTextColor(getContrastColor(hex));
    },
    [textIsAuto],
  );

  const handleTextChange = useCallback((hex) => {
    setTextColor(hex);
    setTextIsAuto(false);
  }, []);

  const handleResetTextToAuto = useCallback(() => {
    setTextIsAuto(true);
    setTextColor(getContrastColor(bgColor));
  }, [bgColor]);

  const handleFontChange = useCallback(
    (font) => {
      setFontSlug(font.slug);
      if (!font.weights.includes(fontWeight)) {
        const closest = font.weights.reduce(
          (acc, w) =>
            Math.abs(w - fontWeight) < Math.abs(acc - fontWeight) ? w : acc,
          font.weights[0],
        );
        setFontWeight(closest);
      }
    },
    [fontWeight],
  );

  const handleLogoClick = useCallback(() => logoInputRef.current?.click(), []);
  const handleLogoChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoUrl(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);
  const handleLogoRemove = useCallback((e) => {
    e.stopPropagation();
    setLogoUrl(null);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(bgColor)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {});
  }, [bgColor]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const mutedColor = useMemo(() => getMutedContrastColor(bgColor), [bgColor]);
  const ratio = useMemo(() => getContrastRatio(bgColor), [bgColor]);
  const isDark = getContrastColor(bgColor) === "#FFFFFF";

  const cardBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.82)";
  const cardBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)";
  const chipBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.75)";

  const wcag =
    parseFloat(ratio) >= 7
      ? "AAA"
      : parseFloat(ratio) >= 4.5
        ? "AA"
        : parseFloat(ratio) >= 3
          ? "AA Large"
          : "Fail";
  const wcagColor =
    wcag === "AAA"
      ? "#22C55E"
      : wcag === "AA"
        ? "#3B82F6"
        : wcag === "AA Large"
          ? "#F59E0B"
          : "#EF4444";

  // ── Mobile gate overlay ──────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
          padding: '2rem',
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: 420,
            padding: '2.5rem 2rem',
            borderRadius: 24,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 72,
              height: 72,
              margin: '0 auto 1.5rem',
              borderRadius: 20,
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#F8FAFC',
              marginBottom: '0.75rem',
              lineHeight: 1.2,
            }}
          >
            Open in Desktop Mode
          </h1>

          <p
            style={{
              color: 'rgba(248,250,252,0.6)',
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
            }}
          >
            SeeUI is a powerful design tool with draggable panels, color pickers, and typography controls.
            Switch to <strong style={{ color: '#A5B4FC' }}>desktop mode</strong> to unlock the next level of power.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.625rem 1.5rem',
                borderRadius: 9999,
                background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                color: '#FFF',
                fontWeight: 700,
                fontSize: '0.8125rem',
                boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Use Desktop for Best Experience
            </div>

            <span style={{ color: 'rgba(248,250,252,0.35)', fontSize: '0.75rem' }}>
              Drag panels • Color picker • Font browser
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "SeeUI",
            url: "https://seeui.app",
            description:
              "Stop guessing CSS. Test website background colors, text contrast, and typography instantly. Upload your logo, preview 40+ Google Fonts, check WCAG scores.",
            applicationCategory: "DesignApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Live UI color tester",
              "WCAG contrast checker with image upload",
              "40+ Google Fonts preview",
              "CSS typography playground",
              "Logo color matcher",
              "HEX, RGB, HSL, CMYK color formats",
              "Real-time CSS color changer",
              "Brand color palette generator",
            ],
          }),
        }}
      />

      {/* Inject Google Fonts once for every font + weight */}
      <link rel="stylesheet" href={GOOGLE_FONTS_HREF} />

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both}
        .fade-up-1{animation-delay:0.05s}.fade-up-2{animation-delay:0.12s}
        .fade-up-3{animation-delay:0.20s}.fade-up-4{animation-delay:0.28s}
        @keyframes ping{75%,100%{transform:scale(2.2);opacity:0}}
        .dot-ping{animation:ping 1.6s cubic-bezier(0,0,0.2,1) infinite}

        .liquid-btn{position:relative;overflow:hidden;}
        .liquid-btn::before{
          content:"";position:absolute;top:0;left:-100%;width:55%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent);
          transition:left 0.65s ease;pointer-events:none;
        }
        .liquid-btn:hover::before{left:160%;}

        .logo-upload-btn:hover .upload-hint{opacity:1!important}
      `}</style>

      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoChange}
      />

      <main
        className="min-h-screen w-full transition-colors duration-[600ms] ease-in-out"
        style={{ backgroundColor: bgColor, fontFamily }}
      >
        {/* Noise overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.022]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-80 pt-8 sm:px-10 sm:pt-12 lg:pl-[380px]">
          {/* ── Navbar ─────────────────────────────────────────────────── */}
          <nav className="fade-up flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogoClick}
                className="logo-upload-btn relative group flex-shrink-0"
                title={logoUrl ? "Change logo" : "Upload your brand logo"}
              >
                {logoUrl ? (
                  <div className="relative">
                    <img
                      src={logoUrl}
                      alt="Brand logo"
                      className="h-9 w-auto max-w-[120px] rounded-lg object-contain transition-all duration-300"
                      style={{
                        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))",
                      }}
                    />
                    <div
                      className="absolute inset-0 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.45)",
                        backdropFilter: "blur(2px)",
                        WebkitBackdropFilter: "blur(2px)",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <button
                      onClick={handleLogoRemove}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      style={{
                        backgroundColor: "#EF4444",
                        border: "1.5px solid rgba(0,0,0,0.3)",
                      }}
                      title="Remove logo"
                    >
                      <svg
                        width="7"
                        height="7"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FFF"
                        strokeWidth="3"
                        strokeLinecap="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all duration-200 group-hover:scale-[1.02]"
                    style={{
                      backgroundColor: chipBg,
                      border: `1.5px dashed ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)"}`,
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                    }}
                  >
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-500"
                      style={{ backgroundColor: textColor }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={bgColor}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                      </svg>
                    </div>
                    <span
                      className="text-sm tracking-tight transition-colors duration-500"
                      style={{ color: textColor, fontFamily, fontWeight: 700 }}
                    >
                      SeeUI
                    </span>
                    <div
                      className="upload-hint flex items-center gap-1 opacity-0 transition-opacity duration-200 ml-1"
                      style={{ color: mutedColor }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span
                        className="text-[9px] font-medium whitespace-nowrap"
                        style={{ fontFamily }}
                      >
                        Upload logo
                      </span>
                    </div>
                  </div>
                )}
              </button>

              {logoUrl && (
                <span
                  className="text-sm tracking-tight transition-colors duration-500 hidden sm:block"
                  style={{ color: textColor, fontFamily, fontWeight: 700 }}
                >
                  SeeUI
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Compact font badge */}
              <div
                className="hidden md:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] transition-colors duration-500"
                style={{
                  backgroundColor: chipBg,
                  color: mutedColor,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
                title="Active font"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 7 4 4 20 4 20 7" />
                  <line x1="9" y1="20" x2="15" y2="20" />
                  <line x1="12" y1="4" x2="12" y2="20" />
                </svg>
                <span style={{ color: textColor, fontFamily, fontWeight: 600 }}>
                  {activeFont.name}
                </span>
                <span style={{ opacity: 0.6, fontFamily }}>· {fontWeight}</span>
              </div>

              <div
                className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors duration-500"
                style={{
                  backgroundColor: chipBg,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="absolute inline-flex h-full w-full dot-ping rounded-full opacity-75"
                    style={{ backgroundColor: "#22C55E" }}
                  />
                  <span
                    className="relative inline-flex h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "#22C55E" }}
                  />
                </span>
                <span
                  className="text-[11px]"
                  style={{ color: mutedColor, fontFamily, fontWeight: 500 }}
                >
                  Live
                </span>
              </div>

              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors duration-500"
                style={{
                  backgroundColor: chipBg,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="w-3 h-3 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: bgColor,
                    boxShadow: `0 0 0 1.5px ${cardBorder}`,
                  }}
                />
                <span
                  className="text-[11px] font-mono transition-colors duration-500"
                  style={{ color: textColor, fontWeight: 600 }}
                >
                  {bgColor.toUpperCase()}
                </span>
                <span
                  className="w-px h-3"
                  style={{ backgroundColor: cardBorder }}
                />
                <div
                  className="w-3 h-3 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: textColor,
                    boxShadow: `0 0 0 1.5px ${cardBorder}`,
                  }}
                />
                <span
                  className="text-[11px] font-mono transition-colors duration-500"
                  style={{ color: textColor, fontWeight: 600 }}
                >
                  {textColor.toUpperCase()}
                </span>
              </div>
            </div>
          </nav>

          {/* ── Hero ───────────────────────────────────────────────────── */}
          <section className="mt-24 sm:mt-32">
            <div className="fade-up fade-up-1 mb-6 flex flex-wrap items-center gap-2.5">
              <div
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px]"
                style={{
                  backgroundColor: chipBg,
                  color: textColor,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  fontFamily,
                  fontWeight: 600,
                }}
              >
                <span
                  className="inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[9px] uppercase tracking-wider"
                  style={{
                    backgroundColor: wcagColor,
                    color: "#FFF",
                    fontWeight: 900,
                    fontFamily,
                  }}
                >
                  {wcag}
                </span>
                Contrast {ratio}:1
              </div>
              <div
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px]"
                style={{
                  backgroundColor: chipBg,
                  color: mutedColor,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  fontFamily,
                  fontWeight: 500,
                }}
              >
                BG · Text · Font · Drag · Minimise
              </div>
            </div>

            <h1
              className="fade-up fade-up-2 leading-[1.05] tracking-tight transition-colors duration-500"
              style={{
                color: textColor,
                fontFamily,
                fontSize: `clamp(2.2rem, 6vw, ${fontSize}px)`,
                fontWeight,
              }}
            >
              Stop Guessing CSS.
              <br />
              <span
                className="italic"
                style={{
                  opacity: 0.65,
                  fontFamily,
                  fontWeight: Math.max(300, fontWeight - 300),
                }}
              >
                Test Backgrounds, Text,
              </span>
              <br />
              and Logos Instantly.
            </h1>

            <p
              className="fade-up fade-up-3 mt-6 max-w-lg leading-relaxed transition-colors duration-500"
              style={{
                color: mutedColor,
                fontFamily,
                fontSize: "1.0625rem",
                fontWeight: 400,
              }}
            >
              Check text contrast, extract logo colors, and preview typography live.
              Upload your brand logo, swap 40+ Google Fonts, and find the perfect
              color combination — all in real-time.
            </p>

            <div className="fade-up fade-up-4 mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="liquid-btn rounded-full px-6 py-2.5 text-sm transition-all duration-200 active:scale-95"
                style={{
                  backgroundColor: textColor,
                  color: bgColor,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  fontFamily,
                  fontWeight: 700,
                }}
              >
                <span className="flex items-center gap-2 relative z-10">
                  {copied ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                  {copied ? "Copied!" : `Copy ${bgColor.toUpperCase()}`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleLogoClick}
                className="liquid-btn rounded-full px-6 py-2.5 text-sm transition-colors duration-200 active:scale-95"
                style={{
                  backgroundColor: chipBg,
                  color: textColor,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  fontFamily,
                  fontWeight: 600,
                }}
              >
                <span className="flex items-center gap-2 relative z-10">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {logoUrl ? "Change logo" : "Upload logo"}
                </span>
              </button>
            </div>
          </section>

          {/* ── Stats row ──────────────────────────────────────────────── */}
          <section className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Background",
                value: bgColor.toUpperCase(),
                sub: `Contrast ${ratio}:1`,
                mono: true,
              },
              {
                label: "Text",
                value: textColor.toUpperCase(),
                sub: textIsAuto ? "Auto · adapts" : "Manual override",
                mono: true,
              },
              {
                label: "Font",
                value: activeFont.name,
                sub: `${activeFont.category} · ${fontWeight}`,
                mono: false,
              },
            ].map(({ label, value, sub, mono }) => (
              <div
                key={label}
                className="rounded-2xl p-5 sm:p-6 transition-colors duration-500"
                style={{
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              >
                <span
                  className="text-[9.5px] uppercase tracking-widest"
                  style={{ color: mutedColor, fontFamily, fontWeight: 700 }}
                >
                  {label}
                </span>
                <div
                  className="mt-2 text-base sm:text-lg tracking-tight truncate transition-colors duration-500"
                  style={{
                    color: textColor,
                    fontWeight: 700,
                    fontFamily: mono
                      ? "ui-monospace, 'JetBrains Mono', monospace"
                      : fontFamily,
                  }}
                >
                  {value}
                </div>
                <div
                  className="mt-1 text-[10px] transition-colors duration-500"
                  style={{ color: mutedColor, fontFamily }}
                >
                  {sub}
                </div>
              </div>
            ))}
          </section>

          {/* ── Demo cards ─────────────────────────────────────────────── */}
          <section className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Card A — Typography showcase */}
            <div
              className="rounded-2xl p-6 transition-colors duration-500"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <span
                  className="text-[9.5px] uppercase tracking-widest"
                  style={{ color: mutedColor, fontFamily, fontWeight: 700 }}
                >
                  Typography
                </span>
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: bgColor,
                      border: `1.5px solid ${cardBorder}`,
                    }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: textColor,
                      border: `1.5px solid ${cardBorder}`,
                    }}
                  />
                </div>
              </div>
              <div
                className="text-6xl leading-none mb-3 transition-colors duration-500"
                style={{ color: textColor, fontFamily, fontWeight }}
              >
                Aa
              </div>
              <div
                className="text-sm mb-1.5 transition-colors duration-500"
                style={{
                  color: textColor,
                  fontFamily,
                  fontWeight: Math.min(fontWeight, 600),
                }}
              >
                {activeFont.name}
              </div>
              <p
                className="text-xs leading-relaxed transition-colors duration-500"
                style={{ color: mutedColor, fontFamily, fontWeight: 400 }}
              >
                The quick brown fox jumps over the lazy dog — 1234567890.
              </p>
            </div>

            {/* Card B — Logo preview */}
            <div
              className="rounded-2xl p-6 transition-colors duration-500 flex flex-col"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <span
                className="text-[9.5px] uppercase tracking-widest mb-4"
                style={{ color: mutedColor, fontFamily, fontWeight: 700 }}
              >
                {logoUrl ? "Your brand logo" : "Brand preview"}
              </span>
              {logoUrl ? (
                <div className="flex-1 flex items-center justify-center">
                  <img
                    src={logoUrl}
                    alt="Brand logo preview"
                    className="max-h-20 max-w-full object-contain transition-all duration-500"
                    style={{
                      filter: isDark
                        ? "drop-shadow(0 2px 12px rgba(0,0,0,0.4))"
                        : "drop-shadow(0 2px 8px rgba(0,0,0,0.12))",
                    }}
                  />
                </div>
              ) : (
                <button
                  onClick={handleLogoClick}
                  className="liquid-btn flex-1 flex flex-col items-center justify-center rounded-xl gap-2 transition-all duration-200 active:scale-[0.98]"
                  style={{
                    border: `1.5px dashed ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"}`,
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.02)",
                    minHeight: 96,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.07)"
                        : "rgba(0,0,0,0.06)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={mutedColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </div>
                  <span
                    className="text-[10px]"
                    style={{ color: mutedColor, fontFamily, fontWeight: 600 }}
                  >
                    Upload your logo
                  </span>
                  <span
                    className="text-[9px]"
                    style={{ color: mutedColor, opacity: 0.6, fontFamily }}
                  >
                    PNG, SVG, JPG
                  </span>
                </button>
              )}
            </div>

            {/* Card C — Live colour preview */}
            <div
              className="rounded-2xl p-6 transition-colors duration-500 flex flex-col justify-between"
              style={{
                backgroundColor: cardBg,
                border: `1px solid ${cardBorder}`,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[9.5px] uppercase tracking-widest"
                  style={{ color: mutedColor, fontFamily, fontWeight: 700 }}
                >
                  Live preview
                </span>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider"
                  style={{
                    backgroundColor: `${wcagColor}22`,
                    color: wcagColor,
                    border: `1px solid ${wcagColor}44`,
                    fontFamily,
                    fontWeight: 900,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: wcagColor }}
                  />
                  {wcag}
                </span>
              </div>
              <div
                className="mt-4 h-14 rounded-xl flex items-center justify-center transition-colors duration-500"
                style={{
                  backgroundColor: bgColor,
                  border: `2px solid ${cardBorder}`,
                }}
              >
                <span
                  className="text-base transition-colors duration-500"
                  style={{ color: textColor, fontFamily, fontWeight: 700 }}
                >
                  Sample
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div
                  className="rounded-lg p-2 text-center"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="text-[8.5px] uppercase tracking-wider mb-0.5"
                    style={{ color: mutedColor, fontFamily }}
                  >
                    BG
                  </div>
                  <div
                    className="text-[10px] font-mono"
                    style={{ color: textColor, fontWeight: 700 }}
                  >
                    {bgColor.toUpperCase()}
                  </div>
                </div>
                <div
                  className="rounded-lg p-2 text-center"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="text-[8.5px] uppercase tracking-wider mb-0.5"
                    style={{ color: mutedColor, fontFamily }}
                  >
                    Text
                  </div>
                  <div
                    className="text-[10px] font-mono"
                    style={{ color: textColor, fontWeight: 700 }}
                  >
                    {textColor.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Type sampler ───────────────────────────────────────────── */}
          <div
            className="mt-3 rounded-2xl p-6 transition-colors duration-500"
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <span
                className="text-[9.5px] uppercase tracking-widest"
                style={{ color: mutedColor, fontFamily, fontWeight: 700 }}
              >
                Type sampler
              </span>
              <span
                className="text-[10px] font-mono"
                style={{ color: mutedColor }}
              >
                {activeFont.name} · {fontWeight} · {fontSize}px
              </span>
            </div>

            <div className="space-y-4">
              <div
                className="leading-[1.05] tracking-tight transition-colors duration-500"
                style={{
                  color: textColor,
                  fontFamily,
                  fontSize: `${Math.min(fontSize * 1.2, 80)}px`,
                  fontWeight,
                }}
              >
                Headline 01
              </div>
              <div
                className="leading-tight transition-colors duration-500"
                style={{
                  color: textColor,
                  fontFamily,
                  fontSize: `${Math.min(fontSize * 0.55, 36)}px`,
                  fontWeight: Math.min(fontWeight, 600),
                }}
              >
                Subheading that adapts beautifully
              </div>
              <div
                className="leading-relaxed transition-colors duration-500"
                style={{
                  color: mutedColor,
                  fontFamily,
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              >
                Body copy at regular weight. The five boxing wizards jump
                quickly. Pack my box with five dozen liquor jugs.
              </div>
              <div
                className="flex items-center gap-2 flex-wrap pt-4"
                style={{ borderTop: `1px solid ${cardBorder}` }}
              >
                <span
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: mutedColor, fontFamily, fontWeight: 700 }}
                >
                  Weights
                </span>
                {activeFont.weights.map((w) => (
                  <button
                    key={w}
                    onClick={() => setFontWeight(w)}
                    className="liquid-btn text-sm px-3 py-1.5 rounded-lg transition-colors duration-200 active:scale-95"
                    style={{
                      color: w === fontWeight ? bgColor : textColor,
                      backgroundColor:
                        w === fontWeight ? textColor : "transparent",
                      border:
                        w === fontWeight ? "none" : `1px solid ${cardBorder}`,
                      fontFamily,
                      fontWeight: w,
                    }}
                  >
                    Aa {w}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating boards */}
        <TypographyBoard
          fontSlug={fontSlug}
          fontWeight={fontWeight}
          fontSize={fontSize}
          fontWeightsAvailable={activeFont.weights}
          onFontChange={handleFontChange}
          onWeightChange={setFontWeight}
          onSizeChange={setFontSize}
        />

        <ColorBoard
          bgHex={bgColor}
          textHex={textColor}
          onBgChange={handleBgChange}
          onTextChange={handleTextChange}
          onResetText={handleResetTextToAuto}
          textIsAuto={textIsAuto}
        />

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <footer
          className="relative z-10 mx-auto max-w-5xl px-6 pb-8 sm:px-10 lg:pl-[380px]"
          style={{ marginTop: -200 }}
        >
          <div
            className="rounded-2xl p-6 transition-colors duration-500"
            style={{
              backgroundColor: cardBg,
              border: `1px solid ${cardBorder}`,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div
                  className="text-sm font-semibold mb-1 transition-colors duration-500"
                  style={{ color: textColor, fontFamily }}
                >
                  SeeUI
                </div>
                <p
                  className="text-xs transition-colors duration-500"
                  style={{ color: mutedColor, fontFamily }}
                >
                  Live UI Color Tester & Typography Playground. Free forever.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="text-[10px] transition-colors duration-500"
                  style={{ color: mutedColor, fontFamily }}
                >
                  © {new Date().getFullYear()} SeeUI
                </span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
