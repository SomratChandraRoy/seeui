
import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import FONTS, { FONT_CATEGORIES, WEIGHT_LABELS } from "../data/fonts";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconMinus = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconCheck = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const BOARD_W = 320;

export default function TypographyBoard({
  fontSlug,
  fontWeight,
  fontSize,
  fontWeightsAvailable,
  onFontChange,
  onWeightChange,
  onSizeChange,
}) {
  const [category, setCategory] = useState("all");
  const [minimized, setMinimized] = useState(false);
  const [pos, setPos] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const boardRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);
  const pendingPos = useRef(null);

  // Clean up any pending animation frame on unmount
  useEffect(
    () => () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    },
    [],
  );

  const filteredFonts = useMemo(() => {
    if (category === "all") return FONTS;
    return FONTS.filter((f) => f.category === category);
  }, [category]);

  const activeFont = useMemo(
    () => FONTS.find((f) => f.slug === fontSlug) || FONTS[0],
    [fontSlug],
  );

  // ── Smooth rAF-throttled drag ──────────────────────────────────────────────
  const onBoardDown = useCallback((e) => {
    if (e.target.closest("[data-nodrag]")) return;
    setIsDragging(true);
    const rect = boardRef.current.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onBoardMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
      const vh = typeof window !== "undefined" ? window.innerHeight : 900;
      const bw = boardRef.current?.offsetWidth || BOARD_W;
      const bh = boardRef.current?.offsetHeight || 520;
      pendingPos.current = {
        x: Math.max(0, Math.min(e.clientX - dragOffset.current.x, vw - bw)),
        y: Math.max(0, Math.min(e.clientY - dragOffset.current.y, vh - bh)),
      };
      if (rafId.current == null) {
        rafId.current = requestAnimationFrame(() => {
          if (pendingPos.current) setPos(pendingPos.current);
          rafId.current = null;
        });
      }
    },
    [isDragging],
  );

  const onBoardUp = useCallback(() => {
    setIsDragging(false);
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    if (pendingPos.current) setPos(pendingPos.current);
  }, []);

  const wrapStyle = pos
    ? {
        position: "fixed",
        left: pos.x,
        top: pos.y,
        bottom: "auto",
        transform: "none",
      }
    : {
        position: "fixed",
        right: 20,
        top: "50%",
        left: "auto",
        transform: "translateY(-50%)",
      };

  // ─── Minimised bubble (left side) ──────────────────────────────────────────
  if (minimized) {
    return (
      <>
        <style>{`
          @keyframes typoPopIn{0%{transform:scale(0.4) translateY(-50%);opacity:0}70%{transform:scale(1.12) translateY(-50%)}100%{transform:scale(1) translateY(-50%);opacity:1}}
          .typo-pop-in{animation:typoPopIn 0.32s cubic-bezier(0.34,1.56,0.64,1) both;}
          @keyframes typoOrbSweep{0%{transform:translateX(-100%) skewX(-20deg)}100%{transform:translateX(200%) skewX(-20deg)}}
          .typo-orb-sweep::before{
            content:"";position:absolute;top:0;left:0;width:60%;height:100%;
            background:linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent);
            animation:typoOrbSweep 3s ease-in-out infinite;pointer-events:none;
          }
        `}</style>
        <button
          onClick={() => setMinimized(false)}
          className="typo-pop-in typo-orb-sweep fixed z-[60] flex items-center justify-center overflow-hidden"
          title="Open typography panel"
          style={{
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            width: 56,
            height: 56,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(168,85,247,0.9))",
            border: "2px solid rgba(255,255,255,0.35)",
            boxShadow:
              "0 8px 32px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            cursor: "pointer",
            color: "#FFF",
          }}
        >
          <span
            className="text-2xl leading-none relative z-10"
            style={{ fontFamily: activeFont.family, fontWeight: 700 }}
          >
            Aa
          </span>
        </button>
      </>
    );
  }

  // ─── Full board ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes typoSlideIn{from{opacity:0;transform:translateX(-16px) translateY(-50%)}to{opacity:1;transform:translateX(0) translateY(-50%)}}
        .typo-enter{animation:typoSlideIn 0.32s cubic-bezier(0.22,1,0.36,1) both;}

        @keyframes typoSweep{
          0%{transform:translateX(-150%) skewX(-25deg)}
          50%{transform:translateX(180%) skewX(-25deg)}
          100%{transform:translateX(180%) skewX(-25deg)}
        }
        .typo-sweep{position:relative;}
        .typo-sweep::after{
          content:"";position:absolute;top:0;left:0;width:30%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);
          animation:typoSweep 8s ease-in-out infinite;
          pointer-events:none;
        }

        .typo-glass-btn{position:relative;overflow:hidden;transition:transform 0.15s, background 0.15s, border-color 0.15s;}
        .typo-glass-btn::before{
          content:"";position:absolute;top:0;left:-100%;width:50%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transition:left 0.55s ease;
          pointer-events:none;
        }
        .typo-glass-btn:hover::before{left:150%;}

        .typo-font-card{transition:transform 0.15s, background 0.15s, border-color 0.15s;}
        .typo-font-card:hover{transform:translateY(-1px);}

        /* Slider — thicker, glassier */
        .typo-range{
          -webkit-appearance:none;appearance:none;width:100%;height:8px;
          background:linear-gradient(90deg,rgba(99,102,241,0.25),rgba(168,85,247,0.25));
          border-radius:9999px;outline:none;
          box-shadow:inset 0 1px 3px rgba(0,0,0,0.4);
        }
        .typo-range::-webkit-slider-thumb{
          -webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;
          background:linear-gradient(135deg,#A5B4FC,#C4B5FD);
          border:2px solid #FFF;cursor:pointer;
          box-shadow:0 2px 8px rgba(99,102,241,0.5);
        }
        .typo-range::-moz-range-thumb{
          width:18px;height:18px;border-radius:50%;
          background:linear-gradient(135deg,#A5B4FC,#C4B5FD);
          border:2px solid #FFF;cursor:pointer;
          box-shadow:0 2px 8px rgba(99,102,241,0.5);
        }
      `}</style>

      <div
        ref={boardRef}
        className="typo-enter typo-sweep z-50 select-none"
        style={{
          ...wrapStyle,
          width: `min(${BOARD_W}px, calc(100vw - 20px))`,
          maxHeight: "min(640px, calc(100vh - 40px))",
          borderRadius: 22,
          overflow: "hidden",
          background:
            "linear-gradient(155deg, rgba(28,28,34,0.88) 0%, rgba(20,20,26,0.94) 100%)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          boxShadow: isDragging
            ? "0 40px 100px rgba(0,0,0,0.85), 0 0 0 1.5px rgba(255,255,255,0.14), inset 0 1px 0 rgba(255,255,255,0.08)"
            : "0 24px 72px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
          cursor: isDragging ? "grabbing" : "default",
          transition: "box-shadow 0.2s",
          willChange: isDragging ? "left, top" : "auto",
          display: "flex",
          flexDirection: "column",
        }}
        onPointerDown={onBoardDown}
        onPointerMove={onBoardMove}
        onPointerUp={onBoardUp}
        onPointerCancel={onBoardUp}
      >
        {/* ── Title bar ───────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <button
                data-nodrag
                onClick={() => setMinimized(true)}
                className="w-3 h-3 rounded-full flex items-center justify-center group"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #FF8585, #EF4444)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 2px rgba(0,0,0,0.3)",
                }}
                title="Minimise"
              >
                <span
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "rgba(80,0,0,0.7)" }}
                >
                  <IconMinus />
                </span>
              </button>
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #FFC97A, #F59E0B)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #6EE7A8, #22C55E)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
                }}
              />
            </div>
            <span
              className="text-[10px] font-black tracking-widest uppercase ml-1.5"
              style={{ color: "#52525E" }}
            >
              Typography
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(168,85,247,0.14))",
                border: "1px solid rgba(99,102,241,0.3)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
              title={activeFont.name}
            >
              <span
                className="text-[13px] leading-none"
                style={{
                  fontFamily: activeFont.family,
                  fontWeight: 700,
                  color: "#C4B5FD",
                }}
              >
                Aa
              </span>
            </div>
            <div style={{ color: "#2E2E38", cursor: "grab" }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="9" cy="7" r="1.2" />
                <circle cx="15" cy="7" r="1.2" />
                <circle cx="9" cy="12" r="1.2" />
                <circle cx="15" cy="12" r="1.2" />
                <circle cx="9" cy="17" r="1.2" />
                <circle cx="15" cy="17" r="1.2" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Category tabs ───────────────────────────────────────────── */}
        <div className="px-3 pt-3 pb-2 flex-shrink-0" data-nodrag>
          <div
            className="flex gap-1 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {FONT_CATEGORIES.map(({ id, label }) => {
              const active = category === id;
              return (
                <button
                  key={id}
                  onClick={() => setCategory(id)}
                  className="typo-glass-btn flex-shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: active
                      ? "linear-gradient(135deg, rgba(99,102,241,0.35), rgba(168,85,247,0.3))"
                      : "rgba(255,255,255,0.04)",
                    color: active ? "#FFF" : "#888",
                    border: active
                      ? "1px solid rgba(99,102,241,0.45)"
                      : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: active
                      ? "inset 0 1px 0 rgba(255,255,255,0.18), 0 2px 8px rgba(99,102,241,0.25)"
                      : "inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Font list ───────────────────────────────────────────────── */}
        <div
          className="px-3 pb-3 overflow-y-auto flex-1"
          data-nodrag
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.1) transparent",
          }}
        >
          <div className="flex flex-col gap-1.5">
            {filteredFonts.map((font) => {
              const isActive = font.slug === fontSlug;
              return (
                <button
                  key={font.slug}
                  onClick={() => onFontChange(font)}
                  className="typo-font-card group flex items-center justify-between rounded-xl px-3 py-2.5 text-left w-full active:scale-[0.98] relative overflow-hidden"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(99,102,241,0.22), rgba(168,85,247,0.16))"
                      : "rgba(255,255,255,0.025)",
                    border: isActive
                      ? "1px solid rgba(99,102,241,0.5)"
                      : "1px solid rgba(255,255,255,0.05)",
                    boxShadow: isActive
                      ? "inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 16px rgba(99,102,241,0.18)"
                      : "inset 0 1px 0 rgba(255,255,255,0.03)",
                  }}
                >
                  {/* left-edge active indicator */}
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "20%",
                        bottom: "20%",
                        width: 3,
                        borderRadius: 9999,
                        background: "linear-gradient(180deg, #818CF8, #C4B5FD)",
                        boxShadow: "0 0 8px rgba(129,140,248,0.6)",
                      }}
                    />
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span
                      className="text-lg leading-tight truncate"
                      style={{
                        color: isActive ? "#FFF" : "#D0D0D8",
                        fontFamily: font.family,
                        fontWeight: 500,
                      }}
                    >
                      {font.name}
                    </span>
                    <span
                      className="text-[9px] uppercase tracking-widest"
                      style={{
                        color: isActive ? "rgba(255,255,255,0.55)" : "#555",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {font.category} · {font.weights.length} weight
                      {font.weights.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  {isActive && (
                    <div
                      className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 ml-2"
                      style={{
                        background: "linear-gradient(135deg, #818CF8, #A78BFA)",
                        color: "#FFF",
                        boxShadow: "0 2px 6px rgba(99,102,241,0.5)",
                      }}
                    >
                      <IconCheck />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Weight + Size controls ──────────────────────────────────── */}
        <div
          className="px-3 pt-3 pb-3 flex-shrink-0"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            background: "linear-gradient(0deg, rgba(0,0,0,0.18), transparent)",
          }}
          data-nodrag
        >
          {/* Weight pills */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: "#52525E" }}
              >
                Weight
              </span>
              <span className="text-[9px] font-mono" style={{ color: "#888" }}>
                {WEIGHT_LABELS[fontWeight] || fontWeight}
              </span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {fontWeightsAvailable.map((w) => {
                const active = w === fontWeight;
                return (
                  <button
                    key={w}
                    onClick={() => onWeightChange(w)}
                    className="typo-glass-btn text-[9.5px] px-2.5 py-1 rounded-lg active:scale-95"
                    style={{
                      background: active
                        ? "linear-gradient(135deg, rgba(99,102,241,0.35), rgba(168,85,247,0.3))"
                        : "rgba(255,255,255,0.04)",
                      color: active ? "#FFF" : "#888",
                      border: active
                        ? "1px solid rgba(99,102,241,0.45)"
                        : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: active
                        ? "inset 0 1px 0 rgba(255,255,255,0.18)"
                        : "none",
                      fontFamily: activeFont.family,
                      fontWeight: w,
                      minWidth: 36,
                    }}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: "#52525E" }}
              >
                Heading size
              </span>
              <span className="text-[9px] font-mono" style={{ color: "#888" }}>
                {fontSize}px
              </span>
            </div>
            <input
              type="range"
              min="32"
              max="96"
              step="1"
              value={fontSize}
              onChange={(e) => onSizeChange(+e.target.value)}
              className="typo-range"
            />
          </div>
        </div>
      </div>
    </>
  );
}
