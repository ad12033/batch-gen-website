"use client";

import { useState } from "react";

// ─── Minimal shadcn-compatible primitives (self-contained) ───────────────────
// Since this is a single-file deliverable we inline lightweight versions.

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Button({ children, variant = "default", size = "default", className = "", onClick, ...props }) {
  const base =
    "inline-flex items-center justify-center font-mono text-xs tracking-widest uppercase transition-colors focus:outline-none disabled:opacity-40 cursor-pointer select-none";
  const variants = {
    default: "bg-white text-black hover:bg-zinc-200 border border-white",
    outline: "bg-transparent text-zinc-200 border border-zinc-700 hover:border-zinc-500 hover:text-white",
    ghost: "bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent",
  };
  const sizes = {
    default: "h-9 px-5 py-2",
    sm: "h-7 px-3 py-1 text-[10px]",
    lg: "h-11 px-8 py-3",
  };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

function Badge({ children, className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase border border-zinc-700 text-zinc-400 bg-zinc-900",
        className
      )}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={cn("bg-zinc-900 border border-zinc-800 rounded-xl p-6", className)}>
      {children}
    </div>
  );
}

function Separator({ className = "" }) {
  return <div className={cn("h-px bg-zinc-800 w-full", className)} />;
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "w-full bg-zinc-950 border border-zinc-800 text-zinc-200 font-mono text-xs px-3 py-2 rounded focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600 transition-colors",
        className
      )}
      {...props}
    />
  );
}

// ─── Dialog ──────────────────────────────────────────────────────────────────
function Dialog({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl p-8 shadow-2xl">
        {children}
      </div>
    </div>
  );
}

// ─── Mock Prompt Batch Panel ──────────────────────────────────────────────────
function MockBatchPanel() {
  const scenes = [
    { id: "SCN-001", status: "DONE", label: "INT. LABORATORY — NIGHT" },
    { id: "SCN-002", status: "DONE", label: "EXT. ROOFTOP — DUSK" },
    { id: "SCN-003", status: "RUN", label: "INT. CONTROL ROOM — DAY" },
    { id: "SCN-004", status: "QUEUE", label: "EXT. ALLEY — RAIN" },
    { id: "SCN-005", status: "QUEUE", label: "INT. OFFICE — MORNING" },
  ];

  const statusColor = {
    DONE: "text-zinc-300",
    RUN: "text-white",
    QUEUE: "text-zinc-600",
  };
  const statusDot = {
    DONE: "bg-zinc-400",
    RUN: "bg-white animate-pulse",
    QUEUE: "bg-zinc-700",
  };

  return (
    <div className="w-full max-w-[480px] bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden font-mono text-xs">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-black">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-700" />
          <div className="w-2 h-2 rounded-full bg-zinc-700" />
          <div className="w-2 h-2 rounded-full bg-zinc-700" />
        </div>
        <span className="text-zinc-600 tracking-widest uppercase text-[10px]">FLOWBATCH — BATCH_001</span>
        <Badge>5 SCENES</Badge>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        {["PROMPTS", "REFS", "OUTPUT"].map((tab, i) => (
          <button
            key={tab}
            className={cn(
              "px-4 py-2 text-[10px] tracking-widest uppercase transition-colors",
              i === 0
                ? "text-white border-b border-white -mb-px"
                : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Prompt input area */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-950">
        <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2">SCENE PROMPT QUEUE</div>
        <div className="space-y-1">
          {scenes.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 px-3 py-2 bg-black border border-zinc-900 rounded"
            >
              <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", statusDot[s.status])} />
              <span className="text-zinc-600 text-[10px] w-16 flex-shrink-0">{s.id}</span>
              <span className={cn("flex-1 truncate", statusColor[s.status])}>{s.label}</span>
              <span className={cn("text-[10px] tracking-widest", statusColor[s.status])}>
                {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Character ref row */}
      <div className="p-4 border-b border-zinc-800">
        <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-3">CHARACTER REFS</div>
        <div className="flex gap-2">
          {["ARIA", "MARCUS", "ELENA"].map((name) => (
            <div
              key={name}
              className="flex-1 flex flex-col items-center gap-1.5 p-2 border border-zinc-800 rounded bg-black"
            >
              <div className="w-8 h-8 rounded border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                <span className="text-zinc-600 text-[8px]">IMG</span>
              </div>
              <span className="text-[9px] text-zinc-500 tracking-widest">{name}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            </div>
          ))}
          <div className="flex-1 flex flex-col items-center justify-center gap-1 p-2 border border-dashed border-zinc-800 rounded">
            <span className="text-zinc-700 text-lg">+</span>
            <span className="text-[9px] text-zinc-700">ADD</span>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-black">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] text-zinc-400 tracking-widest">PROCESSING SCN-003</span>
        </div>
        <button className="text-[10px] tracking-widest text-white border border-zinc-700 px-3 py-1 rounded hover:border-zinc-500 transition-colors">
          PAUSE
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans antialiased">

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border border-zinc-600 rounded flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-sm" />
            </div>
            <span className="font-mono text-sm tracking-widest text-white uppercase">FlowBatch</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {["Features", "Pricing", "Docs"].map((link) => (
              <button
                key={link}
                className="font-mono text-[11px] tracking-widest uppercase text-zinc-500 hover:text-zinc-200 px-4 py-2 transition-colors"
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDialogOpen(true)}>
              Sign In
            </Button>
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm">↓ Download Extension</Button>
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Dot grid texture */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, #3f3f46 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 90% 80% at 50% 30%, black 20%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 30%, black 20%, transparent 100%)",
            opacity: 0.3,
            pointerEvents: "none",
          }}
        />
        {/* Horizontal rule top fade */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent, #3f3f46 30%, #3f3f46 70%, transparent)",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            <div>
              <Badge className="mb-6">GOOGLE FLOW · AI AUTOMATION</Badge>
              <h1 className="text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight text-white">
                Batch prompts.<br />
                Consistent<br />
                characters.<br />
                Every scene.
              </h1>
            </div>
            <p className="text-zinc-400 text-base leading-relaxed max-w-md">
              FlowBatch automates scene generation in Google Flow — maintain character
              consistency across every shot with reference-locked batch processing.
              Built for production pipelines.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
                <Button size="lg">↓ Download Extension</Button>
              </a>
              <Button variant="outline" size="lg">View Demo</Button>
            </div>
            <div className="flex items-center gap-6 pt-2">
              {[["2.4M+", "SCENES GENERATED"], ["98%", "CONSISTENCY RATE"], ["<2s", "PER SCENE"]].map(
                ([val, label]) => (
                  <div key={label}>
                    <div className="text-white font-mono text-lg font-bold">{val}</div>
                    <div className="text-zinc-600 font-mono text-[9px] tracking-widest uppercase mt-0.5">{label}</div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right — mock panel */}
          <div className="flex justify-center lg:justify-end">
            <MockBatchPanel />
          </div>
        </div>
        </div>
      </section>

      <Separator />

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-600 mb-3">CAPABILITIES</div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Built for production workflows</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: "⬡",
              label: "BATCH PROCESSING",
              title: "Queue hundreds of prompts",
              body:
                "Upload structured prompt lists and execute them in parallel across Google Flow's generation engine. No more one-by-one submissions.",
              tags: ["PARALLEL", "QUEUE", "STRUCTURED"],
            },
            {
              icon: "◈",
              label: "CHARACTER CONSISTENCY",
              title: "Lock identities across scenes",
              body:
                "FlowBatch embeds identity anchors in every prompt — faces, outfits, and mannerisms stay consistent from scene one to scene one hundred.",
              tags: ["IDENTITY", "ANCHORING", "CROSS-SCENE"],
            },
            {
              icon: "◉",
              label: "AUTO REFERENCE IMAGES",
              title: "Reference injection engine",
              body:
                "Attach character reference images once. FlowBatch automatically injects the right refs into each prompt based on which characters appear.",
              tags: ["AUTO-INJECT", "REFS", "SMART"],
            },
          ].map((f) => (
            <Card key={f.label} className="flex flex-col gap-5 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl text-zinc-400">{f.icon}</span>
                <Badge>{f.label}</Badge>
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.body}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-zinc-800">
                {f.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[9px] tracking-widest text-zinc-600 uppercase"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-600 mb-3">WORKFLOW</div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Three steps to a full scene batch</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Paste your prompts",
              body: "Drop in a structured list of scene descriptions — plain text, CSV, or JSON. FlowBatch parses character mentions and scene metadata automatically.",
              action: "IMPORT PROMPTS →",
            },
            {
              step: "02",
              title: "Add reference images",
              body: "Upload one reference image per character. FlowBatch indexes each face and outfit, then links them to every prompt where that character appears.",
              action: "ATTACH REFS →",
            },
            {
              step: "03",
              title: "Generate all scenes",
              body: "Hit run. FlowBatch dispatches all prompts to Google Flow in optimized batches, streams results back, and packages your output by scene.",
              action: "RUN BATCH →",
            },
          ].map((step) => (
            <div
              key={step.step}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-6 hover:border-zinc-700 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-4xl font-bold text-zinc-800 group-hover:text-zinc-700 transition-colors">
                  {step.step}
                </span>
                <div className="w-px h-8 bg-zinc-800" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.body}</p>
              </div>
              <button className="font-mono text-[10px] tracking-widest uppercase text-zinc-600 hover:text-zinc-300 transition-colors text-left">
                {step.action}
              </button>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-600 mb-3">PRICING</div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Simple, transparent plans</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              tier: "FREE",
              price: "$0",
              per: "/ FOREVER",
              desc: "For individual creators exploring batch generation.",
              features: [
                "50 scenes / month",
                "3 character refs",
                "Basic batch queue",
                "Community support",
              ],
              cta: "Start Free",
              variant: "outline",
              highlight: false,
            },
            {
              tier: "PRO",
              price: "$29",
              per: "/ MONTH",
              desc: "For serious creators and small teams shipping projects.",
              features: [
                "2,000 scenes / month",
                "Unlimited character refs",
                "Priority batch queue",
                "Auto ref injection",
                "Email support",
              ],
              cta: "Start Pro",
              variant: "default",
              highlight: true,
            },
            {
              tier: "STUDIO",
              price: "$149",
              per: "/ MONTH",
              desc: "For studios and production teams at scale.",
              features: [
                "Unlimited scenes",
                "Unlimited refs",
                "Dedicated queue",
                "Custom pipelines",
                "SLA + dedicated support",
              ],
              cta: "Contact Sales",
              variant: "outline",
              highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.tier}
              className={cn(
                "bg-zinc-900 border rounded-xl p-6 flex flex-col gap-6 transition-colors",
                plan.highlight ? "border-zinc-500" : "border-zinc-800 hover:border-zinc-700"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge>{plan.tier}</Badge>
                  {plan.highlight && (
                    <span className="font-mono text-[9px] tracking-widest uppercase text-white border border-white px-2 py-0.5">
                      POPULAR
                    </span>
                  )}
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-white font-mono">{plan.price}</span>
                  <span className="text-zinc-600 font-mono text-[10px] tracking-widest pb-1">{plan.per}</span>
                </div>
                <p className="text-zinc-500 text-sm mt-2">{plan.desc}</p>
              </div>
              <Separator />
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-400">
                    <span className="text-zinc-600 text-xs">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.variant} className="w-full justify-center">
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border border-zinc-700 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-sm" />
            </div>
            <span className="font-mono text-xs tracking-widest text-zinc-600 uppercase">FlowBatch</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {["Privacy", "Terms", "Docs", "Status", "GitHub"].map((l) => (
              <button
                key={l}
                className="font-mono text-[10px] tracking-widest uppercase text-zinc-700 hover:text-zinc-400 transition-colors"
              >
                {l}
              </button>
            ))}
          </nav>
          <span className="font-mono text-[10px] text-zinc-700 tracking-widest">
            © 2026 FLOWBATCH, INC.
          </span>
        </div>
      </footer>

      {/* ── SIGN IN DIALOG ──────────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <Badge className="mb-2">SECURE ACCESS</Badge>
            <h2 className="text-white font-bold text-lg tracking-tight">Sign in to FlowBatch</h2>
          </div>
          <button
            onClick={() => setDialogOpen(false)}
            className="text-zinc-600 hover:text-zinc-300 transition-colors font-mono text-xs"
          >
            ✕ ESC
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-zinc-600 block mb-1.5">
              EMAIL
            </label>
            <Input
              type="email"
              placeholder="you@studio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-zinc-600 block mb-1.5">
              PASSWORD
            </label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <Button className="w-full justify-center">Sign In</Button>
          <Button variant="ghost" className="w-full justify-center text-zinc-600">
            Sign in with Google Flow SSO →
          </Button>
        </div>
        <p className="text-center font-mono text-[10px] text-zinc-700 tracking-widest mt-4">
          NO ACCOUNT? GET STARTED FREE
        </p>
      </Dialog>
    </div>
  );
}
