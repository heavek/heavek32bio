"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
} from "framer-motion";

// ═══════════════════════════════════════════════════════════════════════════════
// DATA — edit here
// ═══════════════════════════════════════════════════════════════════════════════
const DATA = {
  name: "HEAVEK32",

  hero: {
    image: "https://i.pinimg.com/1200x/41/18/81/411881d2b4ed7267e5105de190ee6d5d.jpg",
  },

  // ─── Настройки ховера ссылок ────────────────────────────────────────────────
  linkHover: {
    bg:   "#e8dde0",   // ← фон при наведении (сейчас: пыльная розовато-серая)
    text: "#1a1215",   // ← цвет текста при наведении
  },

  // ─── Ссылки — меняй href ────────────────────────────────────────────────────
  links: [
    {
      id: 1,
      label: "Telegram",
      href: "https://t.me/heavek32",                   // ← твоя ссылка
      num: "001",
      char: "https://i.pinimg.com/1200x/41/18/81/411881d2b4ed7267e5105de190ee6d5d.jpg",
    },
    {
      id: 2,
      label: "Twitch",
      href: "https://www.twitch.tv/heavek32",              // ← твоя ссылка
      num: "002",
      char: "https://i.pinimg.com/736x/58/a2/e5/58a2e5db2bd0b2806f9d4219cdbfa202.jpg",
    },
    {
      id: 3,
      label: "Steam",
      href: "https://steamcommunity.com/profiles/76561199588136407/",     // ← твоя ссылка
      num: "003",
      char: "https://i.pinimg.com/736x/ec/a0/2d/eca02d4d775626e23e026a6346eb2cea.jpg",
    },
  ],

  terminal: [
    { kind: "sys" as const, text: "// interests.sys — loaded" },
    { kind: "ok"  as const, text: "Dota 2        хуйня  Active" },
    { kind: "ok"  as const, text: "Rust          хуйня2  Farming" },
    { kind: "ok"  as const, text: "Minecraft     хуйня3  Technical Building" },
    { kind: "dim" as const, text: "> _" },
  ],
};
// ═══════════════════════════════════════════════════════════════════════════════

const SERIF = "var(--font-playfair), Georgia, serif";
const MONO  = "var(--font-mono), monospace";

// Soft pink palette
const PINK     = "#f0c0cc";             // primary text
const PINK_MED = "rgba(240,192,204,0.55)";  // dimmed
const PINK_DIM = "rgba(240,192,204,0.18)";  // very dim
const PINK_GHO = "rgba(240,192,204,0.08)";  // ghost

// ── Grain overlay ──────────────────────────────────────────────────────────────
function GrainOverlay() {
  return <div className="film-grain" aria-hidden />;
}

// ── Scanline ───────────────────────────────────────────────────────────────────
function Scanline() {
  return (
    <div
      className="pointer-events-none fixed left-0 right-0 h-px z-[95]"
      style={{
        background: `linear-gradient(to right,transparent,${PINK_GHO},transparent)`,
        animation: "scanline 10s linear infinite",
      }}
      aria-hidden
    />
  );
}

// ── Custom cursor ──────────────────────────────────────────────────────────────
function CustomCursor() {
  const cx = useMotionValue(-300);
  const cy = useMotionValue(-300);
  const rx = useSpring(cx, { stiffness: 55, damping: 14 });
  const ry = useSpring(cy, { stiffness: 55, damping: 14 });

  useEffect(() => {
    const fn = (e: MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [cx, cy]);

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-[9999] w-1 h-1 rounded-full mix-blend-difference"
        style={{ x: cx, y: cy, translateX: "-50%", translateY: "-50%", background: PINK }}
      />
      <motion.div
        className="fixed pointer-events-none z-[9999] w-8 h-8 rounded-full mix-blend-difference"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%", border: `1px solid ${PINK_DIM}` }}
      />
    </>
  );
}

// ── Glitch text ────────────────────────────────────────────────────────────────
function GlitchText({ text }: { text: string }) {
  return (
    <span className="relative inline-block select-none">
      <span className="relative z-10">{text}</span>
      <span
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{ color: PINK, animation: "glitchA 5s infinite steps(1)" }}
      >
        {text}
      </span>
      <span
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{ color: PINK, animation: "glitchB 5s infinite steps(1) 0.35s" }}
      >
        {text}
      </span>
    </span>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY            = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const contentY       = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center">
      {/* Parallax BG */}
      <motion.div className="absolute inset-[-12%] z-0" style={{ y: bgY }}>
        <div
          className="w-full h-full"
          style={{
            backgroundImage:    `url(${DATA.hero.image})`,
            backgroundSize:     "cover",
            backgroundPosition: "center top",
            filter:             "grayscale(100%) contrast(1.05)",
          }}
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0 z-[1] bg-black/60" />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 35%, black 115%)" }}
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, black 0%, transparent 18%, transparent 72%, black 100%)" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-[10] flex flex-col items-center gap-10 text-center px-6"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.h1
          className="leading-none uppercase"
          style={{
            fontSize:      "clamp(4rem, 20vw, 17rem)",
            fontFamily:    SERIF,
            fontWeight:    900,
            letterSpacing: "0.18em",
            color:         PINK,
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlitchText text={DATA.name} />
        </motion.h1>

        <motion.div
          className="h-px"
          style={{
            width:      "clamp(60px, 10vw, 120px)",
            background: PINK_GHO,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.p
          className="uppercase"
          style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.65em", color: PINK_DIM }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          scroll
        </motion.p>
      </motion.div>
    </section>
  );
}

// ── Link row ───────────────────────────────────────────────────────────────────
function LinkRow({ link, index }: { link: (typeof DATA.links)[number]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-center overflow-hidden border-b cursor-pointer"
      style={{
        borderColor:     hovered ? "rgba(0,0,0,0.08)" : PINK_GHO,
        backgroundColor: hovered ? DATA.linkHover.bg   : "#000",
        color:           hovered ? DATA.linkHover.text : PINK,
        transition:      "background-color 0.38s cubic-bezier(0.16,1,0.3,1), color 0.38s cubic-bezier(0.16,1,0.3,1), border-color 0.38s ease",
        padding:         "clamp(20px, 3vh, 36px) 0",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index * 0.09 }}
    >
      {/* Character — right portrait, revealed on hover */}
      <div
        className="absolute right-0 top-0 h-full w-1/2 pointer-events-none"
        style={{
          backgroundImage:    `url(${link.char})`,
          backgroundSize:     "cover",
          backgroundPosition: "center top",
          filter:             "grayscale(100%)",
          opacity:            hovered ? 0.38 : 0,
          transition:         "opacity 0.42s ease",
          maskImage:          "linear-gradient(to right, transparent 0%, black 30%)",
          WebkitMaskImage:    "linear-gradient(to right, transparent 0%, black 30%)",
        }}
        aria-hidden
      />

      {/* Inner layout */}
      <div className="relative z-10 flex items-center justify-between w-full px-8 md:px-20">
        <span
          className="shrink-0 w-12 opacity-30"
          style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.45em" }}
        >
          {link.num}
        </span>

        <span
          className="flex-1 text-center uppercase"
          style={{
            fontFamily:    SERIF,
            fontWeight:    900,
            fontSize:      "clamp(1.4rem, 3.5vw, 2.8rem)",
            letterSpacing: "0.15em",
          }}
        >
          {link.label}
        </span>

        <span
          className="shrink-0 w-12 text-right opacity-30"
          style={{ fontFamily: MONO, fontSize: "11px" }}
        >
          ↗
        </span>
      </div>
    </motion.a>
  );
}

// ── Links section ──────────────────────────────────────────────────────────────
function LinksSection() {
  return (
    <section style={{ borderTop: `1px solid ${PINK_GHO}` }}>
      <div className="px-8 md:px-20 py-4" style={{ borderBottom: `1px solid ${PINK_GHO}` }}>
        <span
          className="uppercase"
          style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.55em", color: PINK_DIM }}
        >
          [ 01 ] — Network
        </span>
      </div>
      {DATA.links.map((link, i) => (
        <LinkRow key={link.id} link={link} index={i} />
      ))}
    </section>
  );
}

// ── Terminal line ──────────────────────────────────────────────────────────────
function TerminalLine({
  entry,
  delay,
}: {
  entry: (typeof DATA.terminal)[number];
  delay: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setTyped(entry.text.slice(0, i));
        if (i >= entry.text.length) clearInterval(iv);
      }, 15);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [inView, entry.text, delay]);

  const color =
    entry.kind === "sys" ? PINK_DIM :
    entry.kind === "ok"  ? PINK_MED :
                           PINK_GHO;

  return (
    <div ref={ref} className="flex items-baseline gap-4 min-h-7">
      <span
        className="w-7 shrink-0 select-none uppercase"
        style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.3em", color: PINK_GHO }}
      >
        {entry.kind === "sys" ? "sys" : entry.kind === "ok" ? " ok" : ""}
      </span>
      <span className="text-xs leading-7" style={{ fontFamily: MONO, color }}>
        {typed}
        {inView && typed.length < entry.text.length && (
          <span style={{ animation: "blink 0.7s infinite", color: PINK }}>▋</span>
        )}
      </span>
    </div>
  );
}

// ── Terminal section ───────────────────────────────────────────────────────────
function TerminalSection() {
  return (
    <section className="px-8 md:px-20 py-28" style={{ borderTop: `1px solid ${PINK_GHO}` }}>
      <div className="mb-14">
        <span
          className="uppercase"
          style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.55em", color: PINK_DIM }}
        >
          [ 02 ] — Interests
        </span>
      </div>

      <motion.div
        className="max-w-lg"
        style={{ border: `1px solid ${PINK_GHO}`, background: "rgba(240,192,204,0.02)" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center gap-2 px-5 py-3"
          style={{ borderBottom: `1px solid ${PINK_GHO}`, background: "rgba(240,192,204,0.015)" }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: PINK_GHO }}
            />
          ))}
          <span
            className="ml-2"
            style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.35em", color: PINK_GHO }}
          >
            bash — heavek32@local
          </span>
        </div>

        {/* Lines */}
        <div className="px-5 py-5 flex flex-col gap-0.5">
          {DATA.terminal.map((entry, i) => (
            <TerminalLine key={i} entry={entry} delay={i * 230} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="py-16 flex flex-col items-center gap-4"
      style={{ borderTop: `1px solid ${PINK_GHO}` }}
    >
      <div className="w-px h-10" style={{ background: PINK_GHO }} />
      <p
        className="uppercase"
        style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.6em", color: PINK_DIM }}
      >
        {DATA.name} · 2026
      </p>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function Page() {
  return (
    <>
      <GrainOverlay />
      <Scanline />
      <CustomCursor />

      <main className="bg-black overflow-x-hidden cursor-none" style={{ color: PINK }}>
        <HeroSection />
        <LinksSection />
        <TerminalSection />
        <Footer />
      </main>
    </>
  );
}
