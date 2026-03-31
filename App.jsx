import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────── */
const T = {
  cream:   "#F5F0E4",
  parch:   "#EDE5CF",
  darkBg:  "#E8DFC8",
  ink:     "#1A1008",
  inkMid:  "#3D2E10",
  inkFade: "#7A6440",
  gold:    "#C8960C",
  goldDk:  "#A37808",
  goldLt:  "#E8B824",
  rule:    "#C4B48A",
};

/* ─── HELPERS ────────────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

/* ─── DECORATIVE ATOMS ───────────────────────────────────────── */
function Rule({ color = T.rule, my = 0 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: `${my}px 0` }}>
      <div style={{ flex: 1, height: 1, background: color }} />
      <div style={{ width: 6, height: 6, background: color, transform: "rotate(45deg)", flexShrink: 0 }} />
      <div style={{ flex: 1, height: 1, background: color }} />
    </div>
  );
}

function DoubleRule({ color = T.rule, my = 0 }) {
  return (
    <div style={{ margin: `${my}px 0` }}>
      <div style={{ height: 1, background: color }} />
      <div style={{ height: 3 }} />
      <div style={{ height: 1, background: color }} />
    </div>
  );
}

function StripeBar({ height = 10 }) {
  return (
    <div style={{ display: "flex", height, overflow: "hidden", flexShrink: 0 }}>
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{ flex: 1, background: i % 2 === 0 ? T.ink : T.gold }} />
      ))}
    </div>
  );
}

function Stamp({ size = 120 }) {
  const r = size / 2;
  const cx = r, cy = r;
  const textR = r - 14;
  const chars = "ALL GAS NO BRAKES · BUILT FROM YOUNG ·";
  const total = chars.length;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ flexShrink: 0, display: "block" }}>
      <circle cx={cx} cy={cy} r={r - 2} fill={T.ink} stroke={T.gold} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={r - 8} fill="none" stroke={T.gold} strokeWidth={0.75} strokeDasharray="3 3" />
      {chars.split("").map((ch, i) => {
        const angle = (i / total) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = cx + textR * Math.cos(rad);
        const y = cy + textR * Math.sin(rad);
        return (
          <text key={i} x={x} y={y}
            textAnchor="middle" dominantBaseline="central"
            fill={T.gold} fontSize={size < 100 ? 6 : 7}
            fontFamily="'IM Fell English', Georgia, serif"
            transform={`rotate(${angle + 90}, ${x}, ${y})`}
          >{ch}</text>
        );
      })}
      <text x={cx} y={cy - 10} textAnchor="middle" fill={T.gold}
        fontSize={size < 100 ? 16 : 20}
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="900">YPA</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill={T.gold}
        fontSize={size < 100 ? 6 : 7.5}
        fontFamily="'IM Fell English', Georgia, serif"
        letterSpacing="2">EST · MMXXIV</text>
    </svg>
  );
}

function ShieldLogo({ size = 40 }) {
  const w = size * 0.78;
  const h = size;
  return (
    <svg viewBox="0 0 75 96" width={w} height={h} style={{ display: "block" }}>
      <path d="M37.5 0 L75 18 L75 66 Q75 88 37.5 96 Q0 88 0 66 L0 18 Z" fill={T.gold} />
      <path d="M37.5 7 L68 23 L68 66 Q68 84 37.5 89 Q7 84 7 66 L7 23 Z" fill={T.ink} />
      <text x="37.5" y="48" textAnchor="middle" dominantBaseline="central"
        fill={T.gold} fontSize="22" fontFamily="'Playfair Display', Georgia, serif" fontWeight="900">YP</text>
      <text x="37.5" y="68" textAnchor="middle" dominantBaseline="central"
        fill={T.gold} fontSize="9" fontFamily="'IM Fell English', Georgia, serif" letterSpacing="2">ATH</text>
    </svg>
  );
}

/* ─── CORNER ORNAMENT ────────────────────────────────────────── */
function Corners({ color = T.gold, size = 20, thickness = 2, offset = 0 }) {
  const pos = [
    { top: offset, left: offset,  rotate: "0deg" },
    { top: offset, right: offset, rotate: "90deg" },
    { bottom: offset, right: offset, rotate: "180deg" },
    { bottom: offset, left: offset, rotate: "270deg" },
  ];
  return (
    <>
      {pos.map((p, i) => (
        <div key={i} style={{
          position: "absolute", ...p,
          width: size, height: size,
          borderTop: `${thickness}px solid ${color}`,
          borderLeft: `${thickness}px solid ${color}`,
          transform: `rotate(${p.rotate})`,
        }} />
      ))}
    </>
  );
}

/* ─── NAVBAR ─────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ height: 2, background: T.gold }} />
      <nav style={{
        background: T.ink,
        padding: "0 5vw",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 68,
        borderBottom: `2px solid ${T.gold}`,
        boxShadow: scrolled ? "0 4px 28px rgba(0,0,0,0.5)" : "none",
        transition: "box-shadow 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => go("home")}>
          <ShieldLogo size={48} />
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 900, color: T.gold, letterSpacing: 2, lineHeight: 1.15 }}>YOUNG PRODIGY</div>
            <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 9, color: T.inkFade, letterSpacing: 5 }}>ATHLETICS</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["about", "training", "contact"].map(id => (
            <button key={id} onClick={() => go(id)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: T.rule, fontFamily: "'IM Fell English', Georgia, serif",
              fontSize: 13, letterSpacing: 3, textTransform: "uppercase",
              padding: "4px 0", borderBottom: "1px solid transparent",
              transition: "color 0.2s, border-color 0.2s",
            }}
              onMouseEnter={e => { e.target.style.color = T.gold; e.target.style.borderBottomColor = T.gold; }}
              onMouseLeave={e => { e.target.style.color = T.rule; e.target.style.borderBottomColor = "transparent"; }}
            >{id}</button>
          ))}
          <button onClick={() => go("contact")} style={{
            background: T.gold, color: T.ink, border: "none", cursor: "pointer",
            padding: "9px 24px",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: 12, letterSpacing: 2,
            transition: "background 0.2s, transform 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = T.goldLt; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.gold; e.currentTarget.style.transform = "none"; }}
          >BOOK NOW</button>
        </div>
      </nav>
    </header>
  );
}

/* ─── HERO ───────────────────────────────────────────────────── */
function Hero() {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);
  return (
    <section id="home" style={{
      background: T.cream,
      minHeight: "92vh",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>
      {/* Side varsity stripe columns */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} style={{ flex: 1, background: i % 2 === 0 ? T.ink : T.gold, minHeight: 10 }} />
        ))}
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 20, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} style={{ flex: 1, background: i % 2 === 0 ? T.ink : T.gold, minHeight: 10 }} />
        ))}
      </div>

      {/* Large watermark text */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", overflow: "hidden",
      }}>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(120px, 22vw, 260px)",
          fontWeight: 900, fontStyle: "italic",
          color: "rgba(26,16,8,0.04)",
          lineHeight: 1, whiteSpace: "nowrap", userSelect: "none",
        }}>PRODIGY</div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px 80px",
        position: "relative", zIndex: 2,
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
        transition: "opacity 0.9s ease, transform 0.9s ease",
      }}>

        {/* Eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 48, height: 1, background: T.inkFade }} />
          <span style={{
            fontFamily: "'IM Fell English', Georgia, serif",
            fontSize: 11, color: T.inkFade, letterSpacing: 5, textTransform: "uppercase", fontStyle: "italic",
          }}>Elite Youth Football Training · Oceanside, CA</span>
          <div style={{ width: 48, height: 1, background: T.inkFade }} />
        </div>

        <DoubleRule color={T.inkFade} my={0} />

        {/* Headline + stamp row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 52,
          margin: "36px 0 28px",
        }}>
          <Stamp size={148} />

          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(62px, 11vw, 118px)",
              fontWeight: 900, lineHeight: 0.88, color: T.ink,
            }}>BUILT</div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(62px, 11vw, 118px)",
              fontWeight: 900, lineHeight: 0.88, color: T.ink,
            }}>FROM</div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(62px, 11vw, 118px)",
              fontWeight: 900, lineHeight: 0.92, fontStyle: "italic",
              color: T.gold,
            }}>Young.</div>
          </div>

          <Stamp size={148} />
        </div>

        <DoubleRule color={T.inkFade} my={0} />

        <p style={{
          fontFamily: "'IM Fell English', Georgia, serif",
          fontSize: 17, color: T.inkMid, lineHeight: 1.9,
          textAlign: "center", maxWidth: 520,
          margin: "28px auto 36px", fontStyle: "italic",
        }}>
          Where work ethic is built, confidence is forged,<br />and prodigies are created.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 16 }}>
          {[
            { label: "VIEW SESSIONS", id: "training", primary: true },
            { label: "OUR PROGRAM",   id: "about",    primary: false },
          ].map(({ label, id, primary }) => (
            <button key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
              style={{
                padding: "13px 36px", cursor: "pointer",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700, fontSize: 12, letterSpacing: 3,
                background: primary ? T.ink : "transparent",
                color:      primary ? T.gold : T.ink,
                border: `2px solid ${T.ink}`,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = primary ? T.gold : T.ink;
                e.currentTarget.style.color = T.ink;
                if (!primary) e.currentTarget.style.color = T.cream;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = primary ? T.ink : "transparent";
                e.currentTarget.style.color = primary ? T.gold : T.ink;
              }}
            >{label}</button>
          ))}
        </div>

        {/* Stats banner */}
        <div style={{
          display: "flex", marginTop: 56,
          border: `1px solid ${T.rule}`,
          background: T.ink,
          width: "100%", maxWidth: 620,
        }}>
          {[
            { num: "I",   label: "Pro Coach" },
            { num: "II",  label: "Programs" },
            { num: "XC",  label: "Min Sessions" },
            { num: "∞",   label: "Potential" },
          ].map((s, i, arr) => (
            <div key={i} style={{
              flex: 1, textAlign: "center", padding: "20px 10px",
              borderRight: i < arr.length - 1 ? `1px solid ${T.inkMid}` : "none",
            }}>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 34, color: T.gold, fontWeight: 900, lineHeight: 1, fontStyle: "italic",
              }}>{s.num}</div>
              <div style={{
                fontFamily: "'IM Fell English', Georgia, serif",
                fontSize: 9, color: T.inkFade, letterSpacing: 3, marginTop: 6, textTransform: "uppercase",
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <StripeBar height={8} />
    </section>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────────── */
function About() {
  const [ref, vis] = useInView();
  return (
    <section id="about" style={{ background: T.parch, padding: "100px 5vw", position: "relative", overflow: "hidden" }}>
      {/* Diagonal watermark */}
      <div style={{
        position: "absolute", right: "-80px", top: "50%",
        transform: "translateY(-50%) rotate(-10deg)",
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 220, fontWeight: 900, fontStyle: "italic",
        color: "rgba(26,16,8,0.04)", pointerEvents: "none",
        lineHeight: 1, userSelect: "none", whiteSpace: "nowrap",
      }}>PRODIGY</div>

      <div ref={ref} style={{
        maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2,
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(32px)",
        transition: "all 0.85s ease",
      }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 11, color: T.inkFade, letterSpacing: 6, marginBottom: 14 }}>— THE PROGRAM —</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, color: T.ink, margin: 0, letterSpacing: -1 }}>
            Our <em style={{ color: T.gold }}>Staff & Mission</em>
          </h2>
          <Rule color={T.rule} my={20} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 64, alignItems: "start" }}>

          {/* Coach card */}
          <div style={{ position: "relative" }}>
            {/* Offset drop shadow */}
            <div style={{ position: "absolute", inset: 0, transform: "translate(8px,8px)", background: T.gold, opacity: 0.22, pointerEvents: "none" }} />
            <div style={{
              position: "relative",
              background: T.ink, border: `2px solid ${T.gold}`,
              padding: 40,
            }}>
              <Corners color={T.gold} size={18} thickness={2} offset={0} />

              <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                <Stamp size={110} />
              </div>
              <DoubleRule color={T.gold} my={0} />

              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 10, color: T.inkFade, letterSpacing: 5, marginBottom: 6 }}>
                  HEAD COACH & TRAINER
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 42, fontWeight: 900, color: T.gold, margin: 0, fontStyle: "italic",
                }}>Coach Young</h3>
              </div>

              <DoubleRule color={T.gold} my={0} />

              <p style={{
                fontFamily: "'IM Fell English', Georgia, serif",
                fontSize: 15, color: "#C4B48A", lineHeight: 1.9,
                marginTop: 20, fontStyle: "italic", textAlign: "center",
              }}>
                A dedicated trainer and mentor — current professional DB & QB arena football player with the{" "}
                <span style={{ color: T.gold }}>Oceanside Bombers</span>. Real game knowledge, discipline, and elite-level techniques in every session.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 24 }}>
                {["DB", "QB", "PRO LEVEL", "BOMBERS"].map(b => (
                  <span key={b} style={{
                    border: `1px solid ${T.gold}`, color: T.gold,
                    padding: "4px 12px",
                    fontFamily: "'IM Fell English', Georgia, serif",
                    fontSize: 10, letterSpacing: 2,
                  }}>{b}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Mission copy */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 11, color: T.inkFade, letterSpacing: 5, marginBottom: 10 }}>
                OUR MISSION
              </div>
              <h3 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, color: T.ink,
                lineHeight: 1.1, margin: 0,
              }}>
                Greatness<br /><em style={{ color: T.gold }}>Starts Young.</em>
              </h3>
            </div>

            <Rule color={T.rule} my={20} />

            <p style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 16, color: T.inkMid, lineHeight: 1.9, marginBottom: 20, fontStyle: "italic" }}>
              At Young Prodigy Athletics, we develop disciplined, confident, and explosive athletes who dominate both on and off the field. Through elite training focused on speed, agility, strength, and football fundamentals, we help young athletes unlock their full potential.
            </p>

            {/* Training pillars */}
            {[
              ["I",   "Speed & Agility",      "Explosive first steps and game-speed footwork drills"],
              ["II",  "Strength & Power",      "Age-appropriate conditioning that builds real athleticism"],
              ["III", "Football Fundamentals", "Routes, reads, coverage — real game technique"],
              ["IV",  "Mindset Training",      "Confidence, focus, and the champion's mentality"],
            ].map(([num, title, desc]) => (
              <div key={num} style={{
                display: "flex", gap: 18, alignItems: "flex-start",
                padding: "18px 0", borderBottom: `1px solid ${T.rule}`,
              }}>
                <div style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 24, fontStyle: "italic", fontWeight: 900,
                  color: T.gold, flexShrink: 0, width: 36, lineHeight: 1,
                }}>{num}</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 3 }}>{title}</div>
                  <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 13, color: T.inkFade, lineHeight: 1.6, fontStyle: "italic" }}>{desc}</div>
                </div>
              </div>
            ))}

            {/* Pull quote */}
            <div style={{
              marginTop: 32, padding: "20px 24px",
              borderLeft: `4px solid ${T.gold}`,
              background: T.cream,
            }}>
              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 17, fontStyle: "italic", fontWeight: 700,
                color: T.ink, margin: 0, lineHeight: 1.5,
              }}>
                "This isn't just training. This is where work ethic is built, confidence is forged, and prodigies are created."
              </p>
              <div style={{ marginTop: 10, fontFamily: "'IM Fell English', Georgia, serif", fontSize: 10, color: T.inkFade, letterSpacing: 3 }}>
                — COACH YOUNG
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TRAINING ───────────────────────────────────────────────── */
const YOUTH_PKGS = [
  { name: "1 Session",   price: "$90",  duration: "90 MIN",     desc: "Single private performance & mindset session with Coach Young.", featured: false },
  { name: "2 Sessions",  price: "$170", duration: "90 MIN × 2", desc: "Two days of focused elite training. Build real momentum.",        featured: false },
  { name: "4 Sessions",  price: "$320", duration: "90 MIN × 4", desc: "Four-day intensive block. The sweet spot for real results.",       featured: true  },
  { name: "8 Sessions",  price: "$600", duration: "90 MIN × 8", desc: "Full commitment. Maximum transformation. All gas no brakes.",      featured: false },
  { name: "Group Camp",  price: "$40",  duration: "90 MIN",     desc: "Train alongside other elite youth athletes. Team energy.",         featured: false },
];
const GYM_PKGS = [
  { name: "1 Session",  price: "$90",  duration: "1 HR",     desc: "One hour of elite private gym training. Adults only.",          featured: false },
  { name: "4 Sessions", price: "$320", duration: "1 HR × 4", desc: "Four-day private gym block. Build the foundation you need.",    featured: true  },
];

function TicketCard({ pkg, delay = 0 }) {
  const [ref, vis] = useInView(0.08);
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: hov ? T.ink : T.cream,
          border: `2px solid ${pkg.featured ? T.gold : T.rule}`,
          padding: "24px 20px",
          position: "relative",
          transition: "background 0.3s, transform 0.2s, box-shadow 0.2s",
          transform: hov ? "translateY(-5px)" : "none",
          boxShadow: hov ? `6px 6px 0 ${T.gold}` : `4px 4px 0 ${T.rule}`,
          cursor: "default",
        }}>
        {pkg.featured && (
          <div style={{
            position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
            background: T.gold, color: T.ink,
            fontFamily: "'IM Fell English', Georgia, serif",
            fontSize: 9, letterSpacing: 3, padding: "3px 12px",
          }}>MOST POPULAR</div>
        )}

        {/* Perforation row top */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: hov ? T.inkMid : T.rule }} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 9, color: T.inkFade, letterSpacing: 4, marginBottom: 6 }}>
            ADMIT ONE · {pkg.duration}
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 40, fontWeight: 900, fontStyle: "italic", color: T.gold, lineHeight: 1 }}>
            {pkg.price}
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 700, color: hov ? T.cream : T.ink, marginTop: 4 }}>
            {pkg.name}
          </div>
        </div>

        <Rule color={hov ? T.inkMid : T.rule} my={0} />

        <p style={{
          fontFamily: "'IM Fell English', Georgia, serif",
          fontSize: 12, lineHeight: 1.7, color: hov ? "#C4B48A" : T.inkFade,
          textAlign: "center", margin: "12px 0 16px", fontStyle: "italic",
        }}>{pkg.desc}</p>

        <Rule color={hov ? T.inkMid : T.rule} my={0} />

        {/* Perforation row bottom */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, marginBottom: 16 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: hov ? T.inkMid : T.rule }} />
          ))}
        </div>

        <button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          style={{
            width: "100%", padding: "10px",
            background: hov ? T.gold : T.ink,
            color: hov ? T.ink : T.gold,
            border: "none", cursor: "pointer",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: 11, letterSpacing: 3,
            transition: "all 0.2s",
          }}>LOCK IN</button>
      </div>
    </div>
  );
}

function Training() {
  const [ref, vis] = useInView();
  const [tab, setTab] = useState("youth");
  const pkgs = tab === "youth" ? YOUTH_PKGS : GYM_PKGS;

  return (
    <section id="training" style={{ background: T.darkBg, padding: "100px 5vw", position: "relative", overflow: "hidden" }}>
      {/* Decorative concentric circles */}
      {[500, 340, 200].map(d => (
        <div key={d} style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          width: d, height: d,
          border: `1px solid ${T.rule}`, borderRadius: "50%",
          opacity: 0.18, pointerEvents: "none",
        }} />
      ))}

      <div ref={ref} style={{
        maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2,
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)",
        transition: "all 0.85s ease",
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 11, color: T.inkFade, letterSpacing: 6, marginBottom: 14 }}>— LOCK IN —</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, color: T.ink, margin: 0 }}>
            Training <em style={{ color: T.gold }}>Sessions</em>
          </h2>
          <Rule color={T.rule} my={20} />
          <p style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 15, color: T.inkFade, fontStyle: "italic", maxWidth: 480, margin: "0 auto" }}>
            Every session is 90 minutes of elite performance and mindset training, led personally by Coach Young.
          </p>
        </div>

        {/* Tab toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
          <div style={{ border: `2px solid ${T.ink}`, display: "flex" }}>
            {[["youth", "Youth Football"], ["gym", "Adult Gym"]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                padding: "10px 30px",
                background: tab === key ? T.ink : "transparent",
                color: tab === key ? T.gold : T.ink,
                border: "none", cursor: "pointer",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700, fontSize: 11, letterSpacing: 2,
                transition: "all 0.2s",
                borderRight: key === "youth" ? `2px solid ${T.ink}` : "none",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(198px, 1fr))", gap: 22 }}>
          {pkgs.map((pkg, i) => <TicketCard key={pkg.name} pkg={pkg} delay={i * 0.07} />)}
        </div>

        {/* Payments */}
        <div style={{ marginTop: 56, paddingTop: 32, borderTop: `1px solid ${T.rule}`, textAlign: "center" }}>
          <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 10, color: T.inkFade, letterSpacing: 5, marginBottom: 16 }}>
            ACCEPTED PAYMENTS
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
            {["Cash App", "Apple Pay", "Google Pay", "Visa", "Mastercard", "Amex", "Discover"].map(m => (
              <span key={m} style={{
                fontFamily: "'IM Fell English', Georgia, serif", fontSize: 11,
                color: T.inkMid, letterSpacing: 1,
                padding: "5px 12px", border: `1px solid ${T.rule}`, background: T.cream,
              }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ────────────────────────────────────────────────── */
function Contact() {
  const [ref, vis] = useInView();
  const [form, setForm] = useState({ name: "", email: "", phone: "", athlete: "", pkg: "", message: "" });
  const [sent, setSent] = useState(false);
  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = e => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", phone: "", athlete: "", pkg: "", message: "" });
    setTimeout(() => setSent(false), 6000);
  };

  const inputStyle = {
    width: "100%", background: T.cream,
    border: `1px solid ${T.rule}`,
    color: T.ink, padding: "12px 14px",
    fontFamily: "'IM Fell English', Georgia, serif",
    fontSize: 14, outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <section id="contact" style={{ background: T.ink, padding: "100px 5vw", position: "relative", overflow: "hidden" }}>
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, ${T.inkMid} 1px, transparent 1px)`,
        backgroundSize: "28px 28px", opacity: 0.22,
      }} />

      <div ref={ref} style={{
        maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 2,
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)",
        transition: "all 0.85s ease",
        display: "grid", gridTemplateColumns: "1fr 1.45fr", gap: 72, alignItems: "start",
      }}>

        {/* Left — info */}
        <div>
          <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 11, color: T.inkFade, letterSpacing: 6, marginBottom: 14 }}>— GET IN TOUCH —</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px,5vw,58px)", fontWeight: 900, color: T.cream, lineHeight: 1.0, margin: "0 0 4px" }}>
            Ready to
          </h2>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px,5vw,58px)", fontWeight: 900, fontStyle: "italic", color: T.gold, lineHeight: 1.0, margin: "0 0 24px" }}>
            Lock In?
          </h2>

          <Rule color={T.inkMid} my={0} />

          <p style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 15, color: "#9a8a6a", lineHeight: 1.9, margin: "24px 0 40px", fontStyle: "italic" }}>
            Reach out to book a session or ask any questions. Coach Young responds personally. No shortcuts. No excuses. Just results.
          </p>

          {[
            { label: "TEXT US",    val: "Available via SMS" },
            { label: "INSTAGRAM",  val: "@YoungProdigyAthletics" },
            { label: "LOCATION",   val: "Oceanside, CA" },
            { label: "POWERED BY", val: "Square Payments" },
          ].map(item => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 16,
              paddingBottom: 18, marginBottom: 18,
              borderBottom: `1px solid ${T.inkMid}`,
            }}>
              <div style={{ width: 8, height: 8, background: T.gold, transform: "rotate(45deg)", flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 9, color: T.inkFade, letterSpacing: 4, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 14, color: T.rule, fontStyle: "italic" }}>{item.val}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 32 }}>
            <Stamp size={110} />
          </div>
        </div>

        {/* Right — form */}
        <div style={{ background: T.cream, border: `2px solid ${T.gold}`, padding: 44, position: "relative" }}>
          <Corners color={T.gold} size={18} thickness={2} offset={0} />

          {sent ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><Stamp size={100} /></div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 30, fontWeight: 900, fontStyle: "italic", color: T.ink, margin: "24px 0 8px" }}>
                Message Sent!
              </h3>
              <p style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 15, color: T.inkFade, fontStyle: "italic" }}>
                Coach Young will be in touch. All gas no brakes!
              </p>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 10, color: T.inkFade, letterSpacing: 5, marginBottom: 6, textAlign: "center" }}>— REGISTRATION —</div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 900, color: T.ink, textAlign: "center", margin: "0 0 4px" }}>
                Book a <em style={{ color: T.gold }}>Session</em>
              </h3>
              <Rule color={T.rule} my={16} />

              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {[
                    { name: "name",  label: "YOUR NAME",  placeholder: "John Smith",      type: "text" },
                    { name: "phone", label: "PHONE",       placeholder: "(555) 000-0000",  type: "text" },
                  ].map(f => (
                    <div key={f.name}>
                      <label style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 10, color: T.inkFade, letterSpacing: 3, display: "block", marginBottom: 6 }}>{f.label}</label>
                      <input name={f.name} value={form[f.name]} onChange={change} type={f.type}
                        placeholder={f.placeholder} required={f.name === "name"}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = T.gold}
                        onBlur={e => e.target.style.borderColor = T.rule} />
                    </div>
                  ))}
                </div>

                {[
                  { name: "email",   label: "EMAIL ADDRESS",      placeholder: "you@email.com",    type: "email", req: true },
                  { name: "athlete", label: "ATHLETE NAME & AGE", placeholder: "Marcus, Age 12",   type: "text",  req: false },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 10, color: T.inkFade, letterSpacing: 3, display: "block", marginBottom: 6 }}>{f.label}</label>
                    <input name={f.name} value={form[f.name]} onChange={change} type={f.type}
                      placeholder={f.placeholder} required={f.req}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = T.gold}
                      onBlur={e => e.target.style.borderColor = T.rule} />
                  </div>
                ))}

                <div>
                  <label style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 10, color: T.inkFade, letterSpacing: 3, display: "block", marginBottom: 6 }}>SESSION INTEREST</label>
                  <select name="pkg" value={form.pkg} onChange={change}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}>
                    <option value="">Select a package...</option>
                    <option>1 Session — Youth Football ($90)</option>
                    <option>2 Sessions — Youth Football ($170)</option>
                    <option>4 Sessions — Youth Football ($320)</option>
                    <option>8 Sessions — Youth Football ($600)</option>
                    <option>Group Camp ($40)</option>
                    <option>1 Session — Adult Gym ($90)</option>
                    <option>4 Sessions — Adult Gym ($320)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 10, color: T.inkFade, letterSpacing: 3, display: "block", marginBottom: 6 }}>MESSAGE</label>
                  <textarea name="message" value={form.message} onChange={change} rows={3}
                    placeholder="Goals, availability, any questions..."
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = T.gold}
                    onBlur={e => e.target.style.borderColor = T.rule} />
                </div>

                <DoubleRule color={T.rule} my={0} />

                <button type="submit" style={{
                  background: T.ink, color: T.gold, border: "none", cursor: "pointer",
                  padding: "14px",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 700, fontSize: 13, letterSpacing: 4,
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.gold; e.currentTarget.style.color = T.ink; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.ink; e.currentTarget.style.color = T.gold; }}>
                  SEND MESSAGE
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────── */
function Footer() {
  return (
    <>
      <StripeBar height={8} />
      <footer style={{ background: T.parch, borderTop: `2px solid ${T.gold}`, padding: "40px 5vw" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <ShieldLogo size={50} />
            <div>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 900, color: T.gold, letterSpacing: 2 }}>YOUNG PRODIGY</div>
              <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 9, color: T.inkFade, letterSpacing: 5 }}>ATHLETICS</div>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 700, color: T.inkFade, fontSize: 15 }}>
              "All Gas No Brakes."
            </div>
            <div style={{ fontFamily: "'IM Fell English', Georgia, serif", fontSize: 11, color: T.rule, letterSpacing: 2, marginTop: 6 }}>
              © {new Date().getFullYear()} Young Prodigy Athletics · Oceanside, CA
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {["Instagram", "Text Us"].map(lnk => (
              <a key={lnk} href="#contact"
                onClick={e => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                style={{
                  fontFamily: "'IM Fell English', Georgia, serif", fontSize: 11,
                  letterSpacing: 2, color: T.inkFade, textDecoration: "none",
                  borderBottom: `1px solid ${T.rule}`, paddingBottom: 2,
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => { e.target.style.color = T.gold; e.target.style.borderBottomColor = T.gold; }}
                onMouseLeave={e => { e.target.style.color = T.inkFade; e.target.style.borderBottomColor = T.rule; }}
              >{lnk}</a>
            ))}
          </div>
        </div>
      </footer>
      <StripeBar height={6} />
    </>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────── */
export default function App() {
  useEffect(() => {
    // Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=IM+Fell+English:ital@0;1&display=swap";
    document.head.appendChild(link);

    // Global reset + overrides
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background: ${T.cream}; color: ${T.ink}; overflow-x: hidden; }
      ::selection { background: ${T.gold}; color: ${T.ink}; }
      input, textarea, select {
        font-family: 'IM Fell English', Georgia, serif !important;
        color: ${T.ink};
      }
      input::placeholder, textarea::placeholder { color: ${T.rule}; font-style: italic; }
      @media (max-width: 820px) {
        section > div > div[style*="grid-template-columns: 1fr 1fr"],
        section > div > div[style*="grid-template-columns: 1fr 1.1fr"],
        section > div > div[style*="grid-template-columns: 1fr 1.4"],
        section > div > div[style*="grid-template-columns: 1fr 1.45"] {
          grid-template-columns: 1fr !important;
          gap: 48px !important;
        }
        section#home > div { padding: 40px 32px !important; }
        section#home div[style*="display: flex"][style*="gap: 52"] {
          flex-direction: column !important;
          gap: 24px !important;
          align-items: center !important;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Training />
      <Contact />
      <Footer />
    </div>
  );
}
