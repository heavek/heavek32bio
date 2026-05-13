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
// DATA
// ═══════════════════════════════════════════════════════════════════════════════
const DATA = {
  name: "HEAVEK32",
  hero: {
    image: "https://i.pinimg.com/1200x/41/18/81/411881d2b4ed7267e5105de190ee6d5d.jpg",
  },
  linkHover: { bg: "#e8dde0", text: "#1a1215" },
  links: [
    { id: 1, label: "Telegram", href: "https://t.me/heavek32", num: "001", char: "https://i.pinimg.com/1200x/41/18/81/411881d2b4ed7267e5105de190ee6d5d.jpg" },
    { id: 2, label: "Twitch",   href: "https://www.twitch.tv/heavek32", num: "002", char: "https://i.pinimg.com/736x/58/a2/e5/58a2e5db2bd0b2806f9d4219cdbfa202.jpg" },
    { id: 3, label: "Steam",    href: "https://steamcommunity.com/profiles/76561199588136407/", num: "003", char: "https://i.pinimg.com/736x/ec/a0/2d/eca02d4d775626e23e026a6346eb2cea.jpg" },
  ],
  terminal: [
    { kind: "sys" as const, text: "// interests.sys — loaded" },
    { kind: "ok"  as const, text: "Dota 2        matadora" },
    { kind: "ok"  as const, text: "Rust          matadora" },
    { kind: "ok"  as const, text: "Minecraft     matadora" },
    { kind: "dim" as const, text: "> _" },
  ],
};

const SOCIALS = [
  {
    id: "telegram", num: "03", sectionLabel: "[ 03 ] — Мессенджер",
    platform: "Telegram", handle: "@heavek32", desc: "Пишите — отвечу",
    href: "https://t.me/heavek32", cta: "Написать",
    image: "https://i.pinimg.com/1200x/41/18/81/411881d2b4ed7267e5105de190ee6d5d.jpg",
    flip: false,
  },
  {
    id: "twitch", num: "04", sectionLabel: "[ 04 ] — Стриминг",
    platform: "Twitch", handle: "heavek32", desc: "Прямые эфиры",
    href: "https://www.twitch.tv/heavek32", cta: "Смотреть",
    image: "https://i.pinimg.com/736x/58/a2/e5/58a2e5db2bd0b2806f9d4219cdbfa202.jpg",
    flip: true,
  },
  {
    id: "steam", num: "05", sectionLabel: "[ 05 ] — Гейминг",
    platform: "Steam", handle: "heavek32", desc: "4000+ часов",
    href: "https://steamcommunity.com/profiles/76561199588136407/", cta: "Добавить",
    image: "https://i.pinimg.com/736x/ec/a0/2d/eca02d4d775626e23e026a6346eb2cea.jpg",
    flip: false,
  },
] as const;

const MESSAGES = [
  { side: "left"  as const, text: "привет гей" },
  { side: "right" as const, text: "привет пидор" },
  { side: "left"  as const, text: "топ катка была" },
  { side: "right" as const, text: "факт соси член" },
  { side: "left"  as const, text: "обязательно" },
];

const CHAT_LINES = [
  { user: "viewer001",  text: "POGGERS" },
  { user: "xd_fan",    text: "gg bro" },
  { user: "spectator",  text: "катка пушка" },
  { user: "dotafan",   text: "ez клатч" },
  { user: "monke32",   text: "LUL" },
  { user: "viewer002", text: "хорошая катка" },
];

const GAMES = [
  { name: "Dota 2",    hours: 2400 },
  { name: "Rust",      hours: 800  },
  { name: "Minecraft", hours: 600  },
];
const MAX_HOURS = 2400;
// ═══════════════════════════════════════════════════════════════════════════════

const SERIF = "var(--font-playfair), Georgia, serif";
const MONO  = "var(--font-mono), monospace";

const PINK     = "#f0c0cc";
const PINK_MED = "rgba(240,192,204,0.55)";
const PINK_DIM = "rgba(240,192,204,0.18)";
const PINK_GHO = "rgba(240,192,204,0.08)";

// ── Grain overlay ──────────────────────────────────────────────────────────────
function GrainOverlay() {
  return <div className="film-grain" aria-hidden />;
}

// ── Scanline ───────────────────────────────────────────────────────────────────
function Scanline() {
  return (
    <div
      className="pointer-events-none fixed left-0 right-0 h-px z-[95]"
      style={{ background: `linear-gradient(to right,transparent,${PINK_GHO},transparent)`, animation: "scanline 10s linear infinite" }}
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
      <motion.div className="fixed pointer-events-none z-[9999] w-1 h-1 rounded-full mix-blend-difference"
        style={{ x: cx, y: cy, translateX: "-50%", translateY: "-50%", background: PINK }} />
      <motion.div className="fixed pointer-events-none z-[9999] w-8 h-8 rounded-full mix-blend-difference"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%", border: `1px solid ${PINK_DIM}` }} />
    </>
  );
}

// ── Glitch text ────────────────────────────────────────────────────────────────
function GlitchText({ text }: { text: string }) {
  return (
    <span className="relative inline-block select-none">
      <span className="relative z-10">{text}</span>
      <span className="absolute inset-0 pointer-events-none" aria-hidden
        style={{ color: PINK, animation: "glitchA 5s infinite steps(1)" }}>{text}</span>
      <span className="absolute inset-0 pointer-events-none" aria-hidden
        style={{ color: PINK, animation: "glitchB 5s infinite steps(1) 0.35s" }}>{text}</span>
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
      <motion.div className="absolute inset-[-12%] z-0" style={{ y: bgY }}>
        <div className="w-full h-full" style={{
          backgroundImage: `url(${DATA.hero.image})`, backgroundSize: "cover",
          backgroundPosition: "center top", filter: "grayscale(100%) contrast(1.05)",
        }} />
      </motion.div>
      <div className="absolute inset-0 z-[1] bg-black/60" />
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 35%, black 115%)" }} />
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, black 0%, transparent 18%, transparent 72%, black 100%)" }} />
      <motion.div
        className="relative z-[10] flex flex-col items-center gap-10 text-center px-6 w-full overflow-hidden"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.h1 className="leading-none uppercase w-full"
          style={{ fontSize: "clamp(2rem, 11vw, 10rem)", fontFamily: SERIF, fontWeight: 900, letterSpacing: "0.12em", color: PINK }}
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}>
          <GlitchText text={DATA.name} />
        </motion.h1>
        <motion.div className="h-px"
          style={{ width: "clamp(60px, 10vw, 120px)", background: PINK_GHO }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
        <motion.p className="uppercase"
          style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.65em", color: PINK_DIM }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}>
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
    <motion.a href={link.href} target="_blank" rel="noopener noreferrer"
      className="relative flex items-center overflow-hidden border-b cursor-pointer"
      style={{
        borderColor: hovered ? "rgba(0,0,0,0.08)" : PINK_GHO,
        backgroundColor: hovered ? DATA.linkHover.bg : "#000",
        color: hovered ? DATA.linkHover.text : PINK,
        transition: "background-color 0.38s cubic-bezier(0.16,1,0.3,1), color 0.38s cubic-bezier(0.16,1,0.3,1), border-color 0.38s ease",
        padding: "clamp(20px, 3vh, 36px) 0",
      }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: index * 0.09 }}>
      <div className="absolute right-0 top-0 h-full w-1/2 pointer-events-none" style={{
        backgroundImage: `url(${link.char})`, backgroundSize: "cover", backgroundPosition: "center top",
        filter: "grayscale(100%) contrast(1.3) brightness(0.55)",
        opacity: hovered ? 0.7 : 0, mixBlendMode: "multiply", transition: "opacity 0.42s ease",
        maskImage: "linear-gradient(to right, transparent 0%, black 30%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%)",
      }} aria-hidden />
      <div className="relative z-10 flex items-center justify-between w-full px-8 md:px-20">
        <span className="shrink-0 w-12 opacity-30" style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.45em" }}>
          {link.num}
        </span>
        <span className="flex-1 text-center uppercase" style={{
          fontFamily: SERIF, fontWeight: 900,
          fontSize: "clamp(1.4rem, 3.5vw, 2.8rem)", letterSpacing: "0.15em",
        }}>
          {link.label}
        </span>
        <span className="shrink-0 w-12 text-right opacity-30" style={{ fontFamily: MONO, fontSize: "11px" }}>↗</span>
      </div>
    </motion.a>
  );
}

// ── Links section ──────────────────────────────────────────────────────────────
function LinksSection() {
  return (
    <section style={{ borderTop: `1px solid ${PINK_GHO}` }}>
      <div className="px-8 md:px-20 py-4" style={{ borderBottom: `1px solid ${PINK_GHO}` }}>
        <span className="uppercase" style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.55em", color: PINK_DIM }}>
          [ 01 ] — Network
        </span>
      </div>
      {DATA.links.map((link, i) => <LinkRow key={link.id} link={link} index={i} />)}
    </section>
  );
}

// ── Terminal line ──────────────────────────────────────────────────────────────
function TerminalLine({ entry, delay }: { entry: (typeof DATA.terminal)[number]; delay: number }) {
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

  const color = entry.kind === "sys" ? PINK_DIM : entry.kind === "ok" ? PINK_MED : PINK_GHO;

  return (
    <div ref={ref} className="flex items-baseline gap-4 min-h-7">
      <span className="w-7 shrink-0 select-none uppercase"
        style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.3em", color: PINK_GHO }}>
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
        <span className="uppercase" style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.55em", color: PINK_DIM }}>
          [ 02 ] — Interests
        </span>
      </div>
      <motion.div className="max-w-lg"
        style={{ border: `1px solid ${PINK_GHO}`, background: "rgba(240,192,204,0.02)" }}
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <div className="flex items-center gap-2 px-5 py-3"
          style={{ borderBottom: `1px solid ${PINK_GHO}`, background: "rgba(240,192,204,0.015)" }}>
          {[0, 1, 2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: PINK_GHO }} />)}
          <span className="ml-2" style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.35em", color: PINK_GHO }}>
            bash — heavek32@local
          </span>
        </div>
        <div className="px-5 py-5 flex flex-col gap-0.5">
          {DATA.terminal.map((entry, i) => <TerminalLine key={i} entry={entry} delay={i * 230} />)}
        </div>
      </motion.div>
    </section>
  );
}

// ── Telegram widget ────────────────────────────────────────────────────────────
function TelegramWidget() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex flex-col gap-2" style={{ maxWidth: 260 }}>
      <span style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.45em", color: PINK_GHO, marginBottom: 4 }}>
        // messages
      </span>
      {MESSAGES.map((msg, i) => (
        <motion.div key={i} className={`flex ${msg.side === "right" ? "justify-end" : "justify-start"}`}
          initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.38 + 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{
            background:    msg.side === "right" ? PINK_DIM : PINK_GHO,
            border:        `1px solid ${msg.side === "right" ? "rgba(240,192,204,0.22)" : "rgba(240,192,204,0.06)"}`,
            borderRadius:  msg.side === "right" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
            padding:       "7px 13px",
            fontFamily:    MONO,
            fontSize:      "11px",
            color:         PINK_MED,
            letterSpacing: "0.02em",
          }}>
            {msg.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Twitch widget ──────────────────────────────────────────────────────────────
function TwitchWidget() {
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true });
  const [lines, setLines] = useState<typeof CHAT_LINES>([]);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    CHAT_LINES.forEach((line, i) => {
      setTimeout(() => setLines(prev => [...prev, line]), i * 650 + 300);
    });
  }, [inView]);

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <motion.div className="w-2 h-2 rounded-full" style={{ background: "#ff4757" }}
          animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} />
        <span style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.55em", color: PINK_DIM }}>
          LIVE NOW
        </span>
      </div>
      <div style={{
        border: `1px solid ${PINK_GHO}`, background: "rgba(240,192,204,0.015)",
        padding: "12px 16px", minHeight: "148px", maxWidth: "270px",
      }}>
        <div style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.4em", color: PINK_GHO, marginBottom: 8 }}>
          — чат —
        </div>
        <div className="flex flex-col gap-1.5">
          {lines.map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28 }} style={{ fontFamily: MONO, fontSize: "10px" }}>
              <span style={{ color: PINK_MED }}>{line.user}:</span>
              <span style={{ color: PINK_DIM }}> {line.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Steam widget ───────────────────────────────────────────────────────────────
function SteamWidget() {
  return (
    <div className="flex flex-col gap-6" style={{ maxWidth: 270 }}>
      <motion.div className="flex items-center gap-3"
        style={{ border: `1px solid ${PINK_GHO}`, background: "rgba(240,192,204,0.015)", padding: "10px 14px" }}
        initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <motion.div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: PINK_MED }}
          animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 2.2, repeat: Infinity }} />
        <div>
          <div style={{ fontFamily: MONO, fontSize: "7px", letterSpacing: "0.5em", color: PINK_GHO, marginBottom: 2 }}>ONLINE</div>
          <div style={{ fontFamily: MONO, fontSize: "10px", color: PINK_MED }}>Dota 2</div>
        </div>
      </motion.div>
      <div className="flex flex-col gap-3">
        <span style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.45em", color: PINK_GHO }}>
          // hours_played
        </span>
        {GAMES.map((game, i) => (
          <motion.div key={game.name} className="flex flex-col gap-1.5"
            initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 + 0.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex justify-between items-baseline">
              <span style={{ fontFamily: MONO, fontSize: "10px", color: PINK_MED }}>{game.name}</span>
              <span style={{ fontFamily: MONO, fontSize: "8px", color: PINK_DIM, letterSpacing: "0.3em" }}>{game.hours}h</span>
            </div>
            <div style={{ height: "1px", background: PINK_GHO, position: "relative", overflow: "hidden" }}>
              <motion.div
                style={{ position: "absolute", top: 0, left: 0, height: "100%", background: PINK_MED }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(game.hours / MAX_HOURS) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Social panel ───────────────────────────────────────────────────────────────
function SocialPanel({ social }: { social: typeof SOCIALS[number] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const [ctaHov, setCtaHov] = useState(false);

  const flip = social.flip;

  const widget =
    social.id === "telegram" ? <TelegramWidget /> :
    social.id === "twitch"   ? <TwitchWidget />   :
                               <SteamWidget />;

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden"
      style={{ borderTop: `1px solid ${PINK_GHO}` }}>

      {/* Mobile bg image */}
      <div className="absolute inset-0 md:hidden" style={{
        backgroundImage: `url(${social.image})`, backgroundSize: "cover",
        backgroundPosition: "center", filter: "grayscale(100%) brightness(0.13)",
      }} />

      {/* Oversized bg number */}
      <div className="absolute select-none pointer-events-none" aria-hidden style={{
        zIndex: 0, fontFamily: SERIF, fontWeight: 900,
        fontSize: "clamp(9rem, 20vw, 19rem)", color: PINK_GHO, lineHeight: 1,
        bottom: "-0.12em",
        ...(flip ? { left: "-0.04em" } : { right: "-0.04em" }),
      }}>
        {social.num}
      </div>

      {/* Grid */}
      <div className="relative grid md:grid-cols-2 min-h-screen" style={{ zIndex: 1 }}>

        {/* Content cell */}
        <div className={`relative flex flex-col justify-center px-8 md:px-16 py-28 ${flip ? "md:order-2" : "md:order-1"}`}>

          <motion.span className="uppercase mb-8 block"
            style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.55em", color: PINK_DIM }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}>
            {social.sectionLabel}
          </motion.span>

          <motion.h2 className="leading-none uppercase mb-3"
            style={{ fontFamily: SERIF, fontWeight: 900, fontSize: "clamp(2.8rem, 7vw, 6.5rem)", letterSpacing: "0.06em", color: PINK }}
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}>
            {social.platform}
          </motion.h2>

          <motion.p className="mb-1"
            style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: "0.35em", color: PINK_DIM }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}>
            {social.handle}
          </motion.p>

          <motion.p className="mb-10"
            style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.45em", color: PINK_GHO }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}>
            {social.desc}
          </motion.p>

          <motion.div className="mb-10"
            style={{ height: "1px", background: PINK_GHO, transformOrigin: "left", width: "clamp(40px, 8vw, 80px)" }}
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.38, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />

          <motion.div className="mb-14"
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.48, duration: 0.8 }}>
            {widget}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.62 }}>
            <a href={social.href} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-4"
              style={{
                fontFamily: MONO, fontSize: "9px", letterSpacing: "0.55em",
                color: ctaHov ? "#000" : PINK,
                border: `1px solid ${ctaHov ? PINK : PINK_DIM}`,
                padding: "14px 28px",
                background: ctaHov ? PINK : "transparent",
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                cursor: "pointer", textDecoration: "none",
              }}
              onMouseEnter={() => setCtaHov(true)}
              onMouseLeave={() => setCtaHov(false)}>
              <span>{social.cta.toUpperCase()}</span>
              <span>↗</span>
            </a>
          </motion.div>
        </div>

        {/* Image cell (desktop only) */}
        <div className={`hidden md:block relative overflow-hidden ${flip ? "md:order-1" : "md:order-2"}`}>
          <motion.div className="absolute w-full" style={{ top: "-15%", height: "130%", y: imgY }}>
            <div className="w-full h-full" style={{
              backgroundImage: `url(${social.image})`, backgroundSize: "cover",
              backgroundPosition: "center", filter: "grayscale(100%) brightness(0.38) contrast(1.1)",
            }} />
          </motion.div>
          <div className="absolute inset-0" style={{
            background: flip
              ? "linear-gradient(to left, black 0%, transparent 55%)"
              : "linear-gradient(to right, black 0%, transparent 55%)",
          }} />
        </div>
      </div>
    </section>
  );
}

// ── Socials section ────────────────────────────────────────────────────────────
function SocialsSection() {
  return (
    <>
      {SOCIALS.map(social => <SocialPanel key={social.id} social={social} />)}
    </>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-16 flex flex-col items-center gap-4" style={{ borderTop: `1px solid ${PINK_GHO}` }}>
      <div className="w-px h-10" style={{ background: PINK_GHO }} />
      <p className="uppercase" style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "0.6em", color: PINK_DIM }}>
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
        <SocialsSection />
        <Footer />
      </main>
    </>
  );
}
