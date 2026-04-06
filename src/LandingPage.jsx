"use client";

import characterReferenceImage from "./assets/character-reference.png";
import sceneContinuityImage from "./assets/scene-continuity.png";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Button({ children, href, variant = "default", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-none border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors";
  const variants = {
    default: "border-white bg-white text-black hover:bg-zinc-200",
    secondary: "border-zinc-800 bg-zinc-950 text-zinc-100 hover:border-zinc-700 hover:bg-zinc-900",
    ghost: "border-zinc-900 bg-transparent text-zinc-400 hover:border-zinc-800 hover:text-zinc-100",
  };

  const content = (
    <>
      {children}
    </>
  );

  if (href) {
    return (
      <a className={cn(base, variants[variant], className)} href={href} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {content}
    </button>
  );
}

function Badge({ children, className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none border border-zinc-800 bg-zinc-950 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={cn("rounded-none border border-zinc-900 bg-zinc-950/88", className)}>
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, copy }) {
  return (
    <div className="max-w-2xl">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">{title}</h2>
      {copy ? <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">{copy}</p> : null}
    </div>
  );
}

function CheckItem({ children }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6 text-zinc-300">
      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
      <span>{children}</span>
    </li>
  );
}

function FeatureCard({ label, title, body }) {
  return (
    <Card className="p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">{label}</div>
      <div className="mt-3 text-lg font-semibold tracking-[-0.03em] text-white">{title}</div>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{body}</p>
    </Card>
  );
}

function ExtensionPanel({ title, subtitle, children }) {
  return (
    <Card className="overflow-hidden border-zinc-800 bg-[linear-gradient(180deg,rgba(14,14,16,0.98),rgba(4,4,5,0.98))] shadow-[0_28px_90px_-45px_rgba(0,0,0,0.9)]">
      <div className="border-b border-zinc-900 bg-black px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-zinc-700" />
            <div className="h-2 w-2 rounded-full bg-zinc-700" />
            <div className="h-2 w-2 rounded-full bg-zinc-700" />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Batch Gen</div>
          <Badge className="border-zinc-800 bg-zinc-950 text-zinc-500">Chrome</Badge>
        </div>
      </div>
      <div className="border-b border-zinc-900 px-4 py-3">
        <div className="flex items-center gap-1">
          {["Create", "Gallery", "Account", "Debug"].map((tab, index) => (
            <div
              key={tab}
              className={cn(
                "rounded-none px-2 py-2 font-mono text-[9px] uppercase tracking-[0.14em]",
                index === 0 ? "bg-zinc-900 text-zinc-50" : "text-zinc-500",
              )}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">{title}</div>
        {subtitle ? <div className="mt-2 text-sm leading-6 text-zinc-300">{subtitle}</div> : null}
        <div className="mt-4">{children}</div>
      </div>
    </Card>
  );
}

function MetricPill({ label, value, tone = "muted" }) {
  const tones = {
    muted: "border-zinc-800 bg-zinc-950 text-zinc-300",
    warn: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  };
  return (
    <div className={cn("rounded-none border px-3 py-2", tones[tone] || tones.muted)}>
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500">{label}</div>
      <div className="mt-1 font-sans text-sm font-semibold">{value}</div>
    </div>
  );
}

function ExtensionShowcase() {
  return (
    <ExtensionPanel
      title="Live extension flow"
      subtitle="This section is styled like the actual popup so the page feels like the product, not just a marketing shell."
    >
      <div className="space-y-3">
        <div className="rounded-none border border-zinc-900 bg-black p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500">Entitlement</div>
              <div className="mt-1 text-sm text-zinc-100">10 free generations every 24 hours</div>
            </div>
            <Badge className="border-zinc-800 bg-zinc-950 text-zinc-300">Guest</Badge>
          </div>
        </div>

        <div className="rounded-none border border-zinc-900 bg-zinc-950 p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">Create</div>
            <Badge className="border-zinc-800 bg-black text-zinc-400">3 scenes</Badge>
          </div>
          <div className="mt-3 space-y-2">
            {[
              "A simple cartoon character with a round bald head…",
              "Scene 02 continues with the same character…",
              "Scene 03 uses the same character in a new location…",
            ].map((line, index) => (
              <div key={line} className="rounded-none border border-zinc-900 bg-black px-3 py-2">
                <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600">Scene {String(index + 1).padStart(2, "0")}</div>
                <div className="mt-1 text-sm text-zinc-200">{line}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <MetricPill label="Continuity" value="Earlier scene refs" />
          <MetricPill label="Character ref" value="Anchor selected scenes" />
          <MetricPill label="Pro" value="$10/month unlimited" tone="warn" />
        </div>
      </div>
    </ExtensionPanel>
  );
}

function ScreenshotCard({ title, copy, image, alt }) {
  return (
    <ExtensionPanel title={title} subtitle={copy}>
      <div className="rounded-none border border-zinc-900 bg-black p-2">
        <img src={image} alt={alt} className="w-full rounded-none border border-zinc-900" />
      </div>
    </ExtensionPanel>
  );
}

export default function LandingPage() {
  const chromeWebStoreUrl = "https://chromewebstore.google.com/detail/batch-gen/odobijhppiaakboadbgpcfhadjdcoppd";

  return (
    <div className="min-h-screen bg-black text-zinc-100 antialiased">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 26%), radial-gradient(circle at 80% 0%, rgba(255,196,87,0.08), transparent 24%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 28%)",
        }}
      />

      <header className="sticky top-0 z-30 border-b border-zinc-900 bg-black/88 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-none border border-zinc-700 bg-zinc-950">
              <div className="h-3 w-3 rounded-none bg-white" />
            </div>
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-white">Batch Gen</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Chrome extension for Google Flow</div>
            </div>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <a className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500 transition-colors hover:text-zinc-100" href="#features">Features</a>
            <a className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500 transition-colors hover:text-zinc-100" href="#screens">Screens</a>
            <a className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500 transition-colors hover:text-zinc-100" href="#pricing">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="hidden md:inline-flex">Chrome Web Store</Badge>
            <Button href={chromeWebStoreUrl} target="_blank" rel="noopener noreferrer">
              Add To Chrome
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Badge>Google Flow image automation</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-6xl xl:text-7xl">
              Batch prompts in Flow without doing every scene by hand.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              Batch Gen is a Chrome extension that speeds up image generation inside Google Flow. Queue scene prompts,
              keep continuity between shots, anchor character references, and download organised results from one control panel.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={chromeWebStoreUrl} target="_blank" rel="noopener noreferrer">
                Add To Chrome
              </Button>
              <a href="#screens">
                <Button variant="secondary">See The Extension</Button>
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">At a glance</div>
              <div className="mt-4 space-y-3">
                <div className="rounded-none border border-zinc-900 bg-black px-3 py-3">
                  <div className="text-sm font-semibold text-white">10 free generations every 24 hours</div>
                </div>
                <div className="rounded-none border border-amber-500/30 bg-amber-500/10 px-3 py-3">
                  <div className="text-sm font-semibold text-amber-200">$10/month for Pro</div>
                </div>
                <div className="rounded-none border border-zinc-900 bg-black px-3 py-3">
                  <div className="text-sm font-semibold text-white">Video coming soon</div>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">What you get</div>
              <ul className="mt-4 space-y-3">
                <CheckItem>Works without sign-in for the free tier</CheckItem>
                <CheckItem>Runs scene batches directly inside Google Flow</CheckItem>
                <CheckItem>Scene continuity between earlier and later shots</CheckItem>
                <CheckItem>Character reference support across selected scenes</CheckItem>
              </ul>
            </Card>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-6 py-20">
          <SectionTitle
            eyebrow="Features"
            title="The current product, not a fake roadmap"
            copy="The site now matches the extension you actually have: image-first workflow automation in Google Flow, free guest usage, Pro billing, continuity tools, and character references."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FeatureCard
              label="Batch generation"
              title="Queue scenes fast"
              body="Enter multiple image prompts, run them in sequence, and stop or restart without rebuilding the whole workflow."
            />
            <FeatureCard
              label="Continuity"
              title="Carry earlier scenes forward"
              body="Later scenes can reference earlier generated results so your visual sequence feels connected rather than random."
            />
            <FeatureCard
              label="Character reference"
              title="Anchor the shots that matter"
              body="Upload a reference image and choose which scenes should stay tied to that character look."
            />
            <FeatureCard
              label="Account and billing"
              title="Guest first, Pro when needed"
              body="Start free without sign-in, then upgrade to Pro for unlimited generation and synced account access."
            />
          </div>
        </section>

        <section id="screens" className="mx-auto max-w-7xl px-6 py-20">
          <SectionTitle
            eyebrow="Inside the extension"
            title="Two of the most important controls"
            copy="These screenshots come from the real extension UI and show the controls that make multi-scene generation more usable in practice."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <ScreenshotCard
              title="Character reference"
              copy="This is framed like the real extension panel, with the same dark chrome and tab structure users see inside Batch Gen."
              image={characterReferenceImage}
              alt="Batch Gen character reference controls"
            />
            <ScreenshotCard
              title="Scene continuity"
              copy="The same UI treatment makes the screenshot feel like part of the extension instead of a detached image dropped onto the page."
              image={sceneContinuityImage}
              alt="Batch Gen scene continuity controls"
            />
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
          <SectionTitle
            eyebrow="Pricing"
            title="Simple and aligned with the extension"
            copy="Free users can try the image workflow without signing in. Pro is for people who want unlimited generation and account-backed billing."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <Card className="p-6">
              <Badge>Free</Badge>
              <div className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white">$0</div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">Guest access available</div>
              <ul className="mt-6 space-y-3">
                <CheckItem>10 free generations every 24 hours</CheckItem>
                <CheckItem>No sign-in required to test the core image workflow</CheckItem>
                <CheckItem>Batch scenes, continuity, downloads, and gallery</CheckItem>
              </ul>
            </Card>

            <Card className="border-amber-500/30 bg-[linear-gradient(180deg,rgba(53,40,13,0.2),rgba(10,10,10,0.98))] p-6">
              <div className="flex items-center justify-between gap-3">
                <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-200">Pro</Badge>
                <Badge className="border-white/15 bg-white/5 text-white">Recommended</Badge>
              </div>
              <div className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white">$10</div>
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">Per month</div>
              <ul className="mt-6 space-y-3">
                <CheckItem>Unlimited generation</CheckItem>
                <CheckItem>Google sign-in and account-backed billing</CheckItem>
                <CheckItem>Subscription state synced across sessions</CheckItem>
              </ul>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 pt-8">
          <Card className="overflow-hidden border-zinc-800 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,196,87,0.06),rgba(255,255,255,0.02))] p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">Chrome extension</div>
                <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                  Install Batch Gen and run it directly where you already work.
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
                  Batch Gen is designed for Chrome and built specifically around Google Flow. Install the extension,
                  open your Flow project, and start batching image scenes without jumping between tabs and manual steps.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href={chromeWebStoreUrl} target="_blank" rel="noopener noreferrer">
                  Add To Chrome
                </Button>
                <a href="#features">
                  <Button variant="secondary">Review features</Button>
                </a>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="border-t border-zinc-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.16em] text-white">Batch Gen</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
              Chrome extension for Google Flow image automation
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
            <a className="transition-colors hover:text-zinc-200" href="#features">Features</a>
            <a className="transition-colors hover:text-zinc-200" href="#screens">Screens</a>
            <a className="transition-colors hover:text-zinc-200" href="#pricing">Pricing</a>
            <a className="transition-colors hover:text-zinc-200" href="/privacy">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
