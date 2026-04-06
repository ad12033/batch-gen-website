import { useEffect, useMemo, useState } from "react";

const bridge = () => window.BatchGenPopupBridge;

const cn = (...classes) => classes.filter(Boolean).join(" ");

const IMAGE_MODEL_OPTIONS = [
  { value: "imagen_4", label: "Imagen 4" },
  { value: "nano_banana_2", label: "Nano Banana 2" },
  { value: "nano_banana_pro", label: "Nano Banana Pro" },
];

const IMAGE_OUTPUT_OPTIONS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
];

const IMAGE_ASPECT_OPTIONS = [
  { value: "crop_16_9", label: "Landscape (16:9)" },
  { value: "crop_4_3", label: "Landscape (4:3)" },
  { value: "crop_square", label: "Square (1:1)" },
  { value: "crop_3_4", label: "Portrait (3:4)" },
  { value: "crop_9_16", label: "Portrait (9:16)" },
];

const VIDEO_MODEL_OPTIONS = [
  { value: "veo_3_1_lite", label: "Veo 3.1 Lite" },
  { value: "veo_3_1_fast", label: "Veo 3.1 Fast" },
  { value: "veo_3_1_quality", label: "Veo 3.1 Quality" },
];

const VIDEO_OUTPUT_OPTIONS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
];

const VIDEO_ASPECT_OPTIONS = [
  { value: "crop_16_9", label: "Landscape (16:9)" },
  { value: "crop_9_16", label: "Portrait (9:16)" },
];

function splitScenes(raw) {
  const text = String(raw || "").replace(/\r\n/g, "\n").trim();
  if (!text) return [];
  const hasBlankLineSeparators = /\n\s*\n/.test(text);
  return text
    .split(hasBlankLineSeparators ? /\n\s*\n/ : /\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function summarizeScenePrompt(prompt, max = 56) {
  const text = String(prompt || "").replace(/\s+/g, " ").trim();
  if (!text) return "Untitled scene";
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

function IconUser({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function IconBolt({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </svg>
  );
}

function Spinner({ className = "" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block h-3.5 w-3.5 rounded-full border border-current border-t-transparent animate-spin",
        className,
      )}
    />
  );
}

function IconGoogle({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.805 12.23c0-.792-.071-1.553-.203-2.282H12v4.32h5.49a4.695 4.695 0 0 1-2.037 3.08v2.558h3.298c1.93-1.777 3.054-4.396 3.054-7.676Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.754 0 5.064-.913 6.752-2.474l-3.298-2.558c-.913.612-2.08.973-3.454.973-2.657 0-4.908-1.794-5.712-4.205H2.88v2.639A9.997 9.997 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.288 13.736A5.996 5.996 0 0 1 5.968 12c0-.603.109-1.188.32-1.736V7.625H2.88A9.997 9.997 0 0 0 2 12c0 1.611.386 3.138 1.069 4.375l3.219-2.639Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.06c1.498 0 2.843.516 3.901 1.528l2.926-2.926C17.06 3.015 14.75 2 12 2A9.997 9.997 0 0 0 2.88 7.625l3.408 2.639C7.092 7.854 9.343 6.06 12 6.06Z"
      />
    </svg>
  );
}

function Button({ children, variant = "default", size = "default", className = "", loading = false, ...props }) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-none border font-mono uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40";
  const variants = {
    default: "border-neutral-900 bg-neutral-900 text-neutral-50 hover:border-neutral-700 hover:bg-neutral-700",
    secondary: "border-neutral-800 bg-neutral-950 text-neutral-200 hover:border-neutral-700 hover:bg-neutral-900",
    ghost: "border-transparent bg-transparent text-neutral-500 hover:bg-neutral-900 hover:text-neutral-200",
    danger: "border-red-500/40 bg-red-500/10 text-red-100 hover:bg-red-500/20",
  };
  const sizes = {
    default: "h-9 px-3 text-[9px]",
    sm: "h-7 px-2.5 text-[9px]",
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

function Card({ children, className = "" }) {
  return <div className={cn("rounded-none border border-neutral-900 bg-neutral-950/90", className)}>{children}</div>;
}

function LockedStage({ children, eyebrow = "Video", copy }) {
  return (
    <div className="relative">
      <div className="pointer-events-none select-none space-y-2.5 blur-[3px] opacity-30 saturate-50">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%),rgba(10,10,12,0.94)] p-4 shadow-[0_28px_90px_-40px_rgba(0,0,0,0.95)] backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.16em] text-neutral-400">{eyebrow}</div>
            <Badge tone="warn">Coming soon</Badge>
          </div>
          <div className="mt-2 text-[13px] font-semibold tracking-[-0.03em] text-neutral-50">
            Shipping image workflows first.
          </div>
          <div className="mt-2 text-[11px] leading-5 text-neutral-400">
            {copy}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Badge({ children, active = false, tone = "muted", className = "" }) {
  const tones = {
    muted: "border-neutral-800 bg-neutral-950 text-neutral-500",
    active: "border-neutral-900 bg-neutral-900 text-neutral-50",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    warn: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    danger: "border-red-500/30 bg-red-500/10 text-red-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em]",
        active ? tones.active : tones[tone] || tones.muted,
        className,
      )}
    >
      {children}
    </span>
  );
}

function Progress({ value = 0, max = 100 }) {
  const width = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  return (
    <div className="h-2 overflow-hidden rounded-none border border-neutral-900 bg-black">
      <div className="h-full rounded-none bg-white transition-all duration-300" style={{ width: `${width}%` }} />
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div
      className="grid gap-1 rounded-none border border-neutral-900 bg-neutral-950/90 p-1"
      style={{ gridTemplateColumns: `repeat(${Math.max(1, tabs.length)}, minmax(0, 1fr))` }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={cn(
            "rounded-none px-2 py-2 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
            active === tab.value
              ? "bg-neutral-900 text-neutral-50"
              : "text-neutral-500 hover:bg-neutral-900 hover:text-neutral-200",
          )}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function useBridgeState() {
  const [state, setState] = useState(() => bridge()?.getState?.() || null);
  useEffect(() => {
    const api = bridge();
    if (!api?.subscribe) return;
    return api.subscribe(setState);
  }, []);
  return state;
}

function formatEntitlement(entitlement) {
  if (!entitlement) {
    return { meterLabel: "0 / 10", copy: "10 free generations every 24 hours.", tone: "muted" };
  }
  if (entitlement.kind === "subscribed") {
    return { meterLabel: "Subscribed", copy: "$10/mo active", tone: "success" };
  }
  if (entitlement.kind === "signed_out") {
    return { meterLabel: "Starting…", copy: "Setting up your free 24-hour window.", tone: "muted" };
  }
  const used = Number(entitlement.used || 0);
  const limit = Number(entitlement.limit || 10);
  const remaining = Number(entitlement.remaining ?? Math.max(0, limit - used));
  const windowHours = Number(entitlement.windowDurationHours || 24);
  const resetAt = entitlement.windowResetAt ? new Date(entitlement.windowResetAt) : null;
  const resetCopy = resetAt && Number.isFinite(resetAt.getTime())
    ? `Resets ${resetAt.toLocaleString()}`
    : `Renews every ${windowHours} hours`;
  if (entitlement.kind === "free_exhausted") {
    return { meterLabel: `${used} / ${limit}`, copy: `24-hour window used. ${resetCopy}.`, tone: "warn" };
  }
  return { meterLabel: `${used} / ${limit}`, copy: `${remaining} free left. ${resetCopy}.`, tone: "muted" };
}

function getRunWaitPreview(state) {
  const preview = state?.runState?.currentPreview || "";
  return /^next scene in /i.test(preview) ? preview : "";
}

function BusyOverlay({ busy }) {
  if (!busy?.visible) return null;
  const toneClasses = busy?.tone === "danger"
    ? "bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.14),transparent_38%),rgba(10,10,12,0.86)] text-red-50"
    : busy?.tone === "success"
      ? "bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_38%),rgba(10,10,12,0.86)] text-emerald-50"
      : "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_36%),rgba(10,10,12,0.88)] text-neutral-50";
  const overlayBackdrop = busy?.tone === "success"
    ? "bg-[rgba(3,8,5,0.62)]"
    : busy?.tone === "danger"
      ? "bg-[rgba(12,4,4,0.62)]"
      : "bg-[rgba(4,4,6,0.58)]";
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className={cn("absolute inset-0 backdrop-blur-md", overlayBackdrop)} />
      <div className={cn("busy-overlay-card relative w-full max-w-sm overflow-hidden rounded-none p-5 shadow-[0_30px_100px_-45px_rgba(0,0,0,0.72)]", toneClasses)}>
        <div className="busy-sheen" aria-hidden="true" />
        <div className="relative flex items-start gap-4">
          <div className="busy-orbit mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-none bg-black/20">
            <Spinner className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <div className="font-sans text-[10px] uppercase tracking-[0.16em] text-neutral-400">Working</div>
            <div className="mt-1 text-[15px] font-semibold tracking-[-0.03em]">{busy?.label || "Working..."}</div>
            <div className="mt-1 text-[12px] leading-5 text-neutral-300">{busy?.detail || "This should only take a moment."}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToastViewport({ toasts = [] }) {
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-3 z-[70] flex flex-col gap-2">
      {toasts.map((toast) => {
        const tone = toast?.variant === "error"
          ? "border-red-500/30 bg-red-500/12 text-red-50"
          : toast?.variant === "ok"
            ? "border-emerald-500/30 bg-emerald-500/12 text-emerald-50"
            : "border-white/12 bg-neutral-950/95 text-neutral-100";
        return (
          <div key={toast.id} className={cn("pointer-events-none rounded-none border px-3 py-2.5 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.85)] backdrop-blur-md", tone)}>
            <div className="font-sans text-[10px] uppercase tracking-[0.14em] opacity-75">Batch Gen</div>
            <div className="mt-1 text-[12px] leading-5">{toast.message}</div>
          </div>
        );
      })}
    </div>
  );
}

function ConfirmOverlay({ confirm, actions }) {
  if (!confirm?.open) return null;
  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/82 backdrop-blur-sm" onClick={() => actions.resolveConfirm?.(false)} />
      <Card className="relative z-10 w-full max-w-sm border-white/10 bg-neutral-950/98 p-4 shadow-[0_24px_100px_-40px_rgba(0,0,0,0.9)]">
        <div className="font-sans text-[10px] uppercase tracking-[0.16em] text-neutral-500">Confirm</div>
        <div className="mt-2 text-[16px] font-semibold tracking-[-0.03em] text-neutral-50">{confirm.title || "Confirm"}</div>
        <div className="mt-2 text-[12px] leading-5 text-neutral-300">{confirm.description || ""}</div>
        <div className="mt-4 flex gap-2">
          <Button className="flex-1" variant="secondary" onClick={() => actions.resolveConfirm?.(false)}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => actions.resolveConfirm?.(true)}>
            {confirm.confirmText || "Confirm"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function CommandPaletteOverlay({ palette, actions }) {
  const commands = useMemo(() => {
    const query = String(palette?.query || "").trim().toLowerCase();
    const source = Array.isArray(palette?.commands) ? palette.commands : [];
    return source.filter((command) => !query || String(command.label || "").toLowerCase().includes(query));
  }, [palette]);

  useEffect(() => {
    if (!palette?.open) return undefined;
    const handler = (event) => {
      if (event.key === "Enter" && commands[0]?.id) {
        event.preventDefault();
        actions.runCommandPaletteCommand?.(commands[0].id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [actions, commands, palette?.open]);

  if (!palette?.open) return null;
  return (
    <div className="fixed inset-0 z-[66] flex items-start justify-center p-4 pt-16">
      <div className="absolute inset-0 bg-black/82 backdrop-blur-sm" onClick={() => actions.closeCommandPalette?.()} />
      <Card className="relative z-10 w-full max-w-md overflow-hidden border-white/10 bg-neutral-950/98 shadow-[0_24px_100px_-40px_rgba(0,0,0,0.9)]">
        <div className="border-b border-neutral-900 p-3">
          <input
            autoFocus
            type="text"
            className="w-full rounded-none border border-neutral-900 bg-black px-3 py-2 font-sans text-[11px] text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-neutral-700"
            placeholder="Type a command…"
            value={palette?.query || ""}
            onChange={(event) => actions.setCommandPaletteQuery?.(event.target.value)}
          />
        </div>
        <div className="max-h-[320px] overflow-auto p-2">
          {commands.length ? commands.map((command) => (
            <button
              key={command.id}
              type="button"
              className="flex w-full items-center justify-between rounded-none px-3 py-2 text-left transition-colors hover:bg-neutral-900"
              onClick={() => actions.runCommandPaletteCommand?.(command.id)}
            >
              <span className="text-[12px] text-neutral-100">{command.label}</span>
              <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">{command.kbd || ""}</span>
            </button>
          )) : (
            <div className="px-3 py-4 text-[11px] text-neutral-500">No matching commands.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

function PreviewLightboxOverlay({ preview, actions }) {
  if (!preview?.open || !preview?.src) return null;
  return (
    <div className="fixed inset-0 z-[64] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/88 backdrop-blur-sm" onClick={() => actions.closePreview?.()} />
      <Card className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-hidden border-white/10 bg-neutral-950/98 shadow-[0_24px_100px_-40px_rgba(0,0,0,0.95)]">
        <div className="flex items-center justify-between border-b border-neutral-900 px-4 py-3">
          <div className="truncate font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            {preview?.label || "Preview"}
          </div>
          <Button variant="ghost" size="sm" onClick={() => actions.closePreview?.()}>
            Close
          </Button>
        </div>
        <div className="bg-black p-3">
          <img src={preview.src} alt={preview.label || "Preview"} className="max-h-[78vh] w-full rounded-none object-contain" />
        </div>
      </Card>
    </div>
  );
}

function Header({ state, onOpenActions, onOpenAccount }) {
  const activeMode = state?.running ? state?.runState?.currentStep || "Running" : "Ready";
  const subscribed = state?.entitlement?.kind === "subscribed";
  return (
    <div className="rounded-none border border-neutral-900 bg-neutral-950/95 p-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.01)]">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-neutral-800 bg-black text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white"
          onClick={onOpenAccount}
          aria-label="Open account"
          title="Account"
        >
          <IconUser className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="font-sans text-[10px] uppercase tracking-[0.16em] text-neutral-500">Batch Gen Studio</div>
            <div className="h-1 w-1 rounded-full bg-neutral-700" />
            <div className="font-sans text-[10px] uppercase tracking-[0.16em] text-neutral-500">{activeMode}</div>
            {subscribed ? (
              <>
                <div className="h-1 w-1 rounded-full bg-neutral-700" />
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-2 py-1 font-sans text-[9px] uppercase tracking-[0.14em] text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
                  Pro live
                </div>
              </>
            ) : null}
          </div>
          <div className="mt-1 text-[15px] font-semibold tracking-[-0.04em] text-neutral-50">Scene studio for Flow.</div>
        </div>
        <Button variant="secondary" size="sm" className="shrink-0" onClick={onOpenActions}>
          Actions
        </Button>
      </div>
    </div>
  );
}

function EntitlementStrip({ state, actions }) {
  const entitlement = formatEntitlement(state?.entitlement);
  const exhausted = state?.entitlement?.kind === "free_exhausted";
  const subscribed = state?.entitlement?.kind === "subscribed";
  if (subscribed) {
    return null;
  }
  const freeStarter = !subscribed && !exhausted;
  return (
    <div className={cn(
      "relative overflow-hidden rounded-none border p-2.5",
      subscribed
        ? "border-emerald-500/20 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_42%),linear-gradient(180deg,#040706_0%,#000_100%)]"
        : exhausted
          ? "upgrade-glow border-neutral-700 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_42%),linear-gradient(180deg,rgba(18,18,20,0.98),rgba(0,0,0,1))] shadow-[0_16px_40px_-24px_rgba(0,0,0,0.55)]"
          : "upgrade-glow border-neutral-800 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_42%),linear-gradient(180deg,rgba(16,16,18,0.96),rgba(0,0,0,1))] shadow-[0_12px_34px_-24px_rgba(0,0,0,0.5)]",
    )}>
      {!subscribed ? (
        <>
          <div className="upgrade-shimmer" aria-hidden="true" />
          <div
            className={cn(
              "pointer-events-none absolute inset-0",
              exhausted
                ? "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_32%)]"
                : "bg-[radial-gradient(circle_at_top_right,rgba(255,245,200,0.08),transparent_32%)]",
            )}
          />
        </>
      ) : null}
      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className={cn(
                "font-sans text-[10px] uppercase tracking-[0.16em]",
                subscribed ? "text-emerald-100/70" : (exhausted ? "text-amber-200/80" : "text-neutral-500"),
              )}>{subscribed ? "Batch Gen Pro" : "Free tier"}</div>
              <Badge tone={subscribed ? "success" : (entitlement.tone === "danger" ? "danger" : entitlement.tone === "success" ? "success" : entitlement.tone === "warn" ? "warn" : "muted")}>
                {subscribed ? "Active" : (state?.entitlement?.label || "Free")}
              </Badge>
            </div>
            <div className="mt-0.5 flex items-baseline gap-2">
              <div className="font-sans text-[15px] text-neutral-50">{subscribed ? "Unlimited" : entitlement.meterLabel}</div>
              <div className={cn("truncate text-[11px]", subscribed ? "text-emerald-100/75" : (exhausted ? "text-amber-100/80" : "text-neutral-500"))}>
                {subscribed ? "All generation features are unlocked on this account." : entitlement.copy}
              </div>
            </div>
            {subscribed ? (
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-none border border-emerald-400/20 bg-emerald-400/8 px-2 py-1 font-sans text-[9px] uppercase tracking-[0.14em] text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
                Subscription active
              </div>
            ) : null}
          </div>
        </div>
        {subscribed ? (
          <Button size="sm" variant="secondary" onClick={() => actions.manageBilling?.()}>
            Billing
          </Button>
        ) : (
          <Button
            size="sm"
            className={cn(
              "upgrade-cta",
              exhausted
                ? "border-neutral-600 bg-neutral-900 text-neutral-100 hover:border-neutral-500 hover:bg-neutral-800"
                : "border-neutral-700 bg-neutral-900 text-neutral-100 hover:border-neutral-600 hover:bg-neutral-800",
            )}
            onClick={() => actions.setTab?.("account")}
            title={state?.auth?.session ? "Open the upgrade card in Account" : "Open Account to sign in and upgrade"}
          >
            {exhausted ? "Open upgrade" : "See plan"}
          </Button>
        )}
      </div>
      {state?.entitlement?.kind !== "subscribed" ? (
        <div className="mt-2">
          <Progress value={Number(state?.entitlement?.used || 0)} max={Number(state?.entitlement?.limit || 10)} />
        </div>
      ) : null}
    </div>
  );
}

function BatchTab({ state, actions }) {
  const createMode = state?.createMode === "video" ? "video" : "image";
  const videoFeatureLocked = !!state?.featureState?.videoGeneration?.comingSoon;
  const createVideoLocked = createMode === "video" && videoFeatureLocked;
  const externalPrompts = createMode === "video" ? (state?.videoPrompts || "") : (state?.prompts || "");
  const [prompts, setPrompts] = useState(externalPrompts);
  useEffect(() => {
    setPrompts(externalPrompts);
  }, [externalPrompts, createMode]);

  const sceneCount = createMode === "video"
    ? (state?.videoSceneCount || 0)
    : (state?.imageSceneCount || state?.sceneCount || 0);
  const waitPreview = getRunWaitPreview(state);
  const runPhase = state?.runState?.runPhase || "idle";
  const busyLabel = String(state?.uiBusy?.label || "").toLowerCase();
  const startingBatch = busyLabel.includes("preparing batch") || busyLabel.includes("preparing video batch");
  const stoppingBatch = busyLabel.includes("stopping batch");
  const clearingReference = busyLabel.includes("removing reference");
  const imageSettings = state?.imageSettings || {};
  const videoSettings = state?.videoSettings || {};
  const entitlementKind = String(state?.entitlement?.kind || "");
  const freeRemaining = Number(state?.entitlement?.remaining ?? 0);
  const isSubscribed = entitlementKind === "subscribed";
  const imageBatchOverLimit = createMode === "image" && !isSubscribed && sceneCount > Math.max(0, freeRemaining);
  const imageScenes = useMemo(
    () => (createMode === "image" ? splitScenes(prompts) : []),
    [createMode, prompts],
  );
  const continuityMap = state?.imageContinuityMap && typeof state.imageContinuityMap === "object"
    ? state.imageContinuityMap
    : {};
  const characterReferenceSceneMap = state?.characterReferenceSceneMap && typeof state.characterReferenceSceneMap === "object"
    ? state.characterReferenceSceneMap
    : {};
  const totalScenes = Number(state?.runState?.total || 0);
  const displayedCount = totalScenes
    ? (runPhase === "complete"
      ? totalScenes
      : Math.min((state?.runState?.currentIndex || 0) + (state?.running ? 1 : 0), totalScenes))
    : 0;
  const badgeTone = runPhase === "failed"
    ? "danger"
    : (runPhase === "stopped"
      ? "warn"
      : (runPhase === "stopping"
        ? "warn"
        : (runPhase === "starting"
          ? "active"
          : (state?.running || runPhase === "finalizing" ? "success" : (runPhase === "complete" ? "active" : "muted")))));
  const badgeLabel = runPhase === "failed"
    ? "Failed"
    : (runPhase === "stopped"
      ? "Stopped"
      : (runPhase === "stopping"
        ? "Stopping"
        : (runPhase === "starting"
          ? "Starting"
          : (state?.running
            ? "Running"
            : (runPhase === "finalizing" ? "Finalizing" : (runPhase === "complete" ? "Complete" : "Idle"))))));
  return (
    <div className="space-y-2.5">
      <Card className="p-1">
        <Tabs
          tabs={[
            { value: "image", label: "Image" },
            { value: "video", label: "Video" },
          ]}
          active={createMode}
          onChange={(value) => actions.setCreateMode?.(value)}
        />
      </Card>

      {createMode === "video" && createVideoLocked ? (
        <LockedStage copy="Video generation stays disabled for now so the shipping extension stays focused on the working image generator.">
          <Card className="p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">Text to video</div>
                <div className="mt-0.5 text-[11px] text-neutral-500">
                  Video controls are parked for now while the shipping extension stays focused on the working image generator.
                </div>
              </div>
              <Badge>{sceneCount} scenes</Badge>
            </div>
            <textarea
              className="min-h-[184px] w-full rounded-none border border-neutral-800 bg-black px-3 py-3 font-sans text-[11px] leading-5 text-neutral-100 outline-none transition-colors placeholder:text-neutral-600 focus:border-neutral-600"
              placeholder="Video scene one prompt here\n\nVideo scene two prompt here\n\nVideo scene three..."
              value={prompts}
              onChange={(event) => {
                const value = event.target.value;
                setPrompts(value);
                actions.setVideoPrompts?.(value);
              }}
              disabled
            />
          </Card>

          <Card className="p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">Text-to-video settings</div>
                <div className="mt-0.5 text-[11px] text-neutral-500">These settings apply only to prompt-to-video batches from Create.</div>
              </div>
              <Badge>Prompt to video</Badge>
            </div>
            <div className="grid gap-2.5 md:grid-cols-3">
              <label className="grid gap-1">
                <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Model</span>
                <select
                  className="h-9 rounded-none border border-neutral-800 bg-black px-3 font-sans text-[11px] text-neutral-100 outline-none transition-colors focus:border-neutral-600"
                  value={videoSettings.model || "veo_3_1_quality"}
                  onChange={(event) => actions.setVideoModel?.(event.target.value)}
                  disabled
                >
                  {VIDEO_MODEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Videos / prompt</span>
                <select
                  className="h-9 rounded-none border border-neutral-800 bg-black px-3 font-sans text-[11px] text-neutral-100 outline-none transition-colors focus:border-neutral-600"
                  value={String(videoSettings.outputCount || 1)}
                  onChange={(event) => actions.setVideoOutputCount?.(Number(event.target.value))}
                  disabled
                >
                  {VIDEO_OUTPUT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <span className="text-[10px] leading-4 text-neutral-600">Prompt-to-video runs live here. Image-to-video still starts from Gallery.</span>
              </label>
              <label className="grid gap-1">
                <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Aspect ratio</span>
                <select
                  className="h-9 rounded-none border border-neutral-800 bg-black px-3 font-sans text-[11px] text-neutral-100 outline-none transition-colors focus:border-neutral-600"
                  value={videoSettings.aspectRatio || "crop_16_9"}
                  onChange={(event) => actions.setVideoAspectRatio?.(event.target.value)}
                  disabled
                >
                  {VIDEO_ASPECT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </Card>
        </LockedStage>
      ) : (
        <>
          <Card className="p-3">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                  {createMode === "video" ? "Text to video" : "Create"}
                </div>
                <div className="mt-0.5 text-[11px] text-neutral-500">
                  {createMode === "video"
                    ? "One video prompt per line, or separate larger scenes with a blank line. Use Gallery -> Generate videos for image-to-video."
                    : "One scene per line, or separate larger scenes with a blank line."}
                </div>
              </div>
              <Badge tone={imageBatchOverLimit ? "danger" : "muted"}>{sceneCount} scenes</Badge>
            </div>
            <textarea
              className={cn(
                "min-h-[184px] w-full rounded-none border bg-black px-3 py-3 font-sans text-[11px] leading-5 text-neutral-100 outline-none transition-colors placeholder:text-neutral-600",
                imageBatchOverLimit
                  ? "border-red-500/50 focus:border-red-400"
                  : "border-neutral-800 focus:border-neutral-600",
              )}
              placeholder={createMode === "video"
                ? "Video scene one prompt here\n\nVideo scene two prompt here\n\nVideo scene three..."
                : "Scene one prompt here\n\nScene two prompt here\n\nScene three..."}
              value={prompts}
              onChange={(event) => {
                const value = event.target.value;
                setPrompts(value);
                if (createMode === "video") {
                  actions.setVideoPrompts?.(value);
                } else {
                  actions.setPrompts(value);
                }
              }}
            />
            {imageBatchOverLimit ? (
              <div className="mt-2.5 rounded-none border border-red-500/30 bg-red-500/8 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-red-200">Over free limit</div>
                    <div className="mt-1 text-[12px] leading-5 text-red-100">
                      This batch has <span className="font-semibold">{sceneCount} scenes</span>, but only{" "}
                      <span className="font-semibold">{freeRemaining}</span> free generations remain in your current 24-hour window.
                    </div>
                    <div className="mt-1 text-[10px] leading-4 text-red-100/80">
                      Reduce the batch size, wait for the reset, or upgrade to unlimited image generation for $10/month.
                    </div>
                    <div className="mt-2 text-[10px] leading-4 text-red-100/75">
                      Includes unlimited image batches, continuity workflows, character references, gallery downloads, and account sync.
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="border-red-400/30 bg-red-500/10 text-red-100 hover:bg-red-500/20"
                    onClick={() => actions.setTab?.("account")}
                  >
                    Upgrade
                  </Button>
                </div>
              </div>
            ) : null}
          </Card>

          {createMode === "image" ? (
            <Card className="p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">Batch settings</div>
                  <div className="mt-0.5 text-[11px] text-neutral-500">These image settings apply to every prompt in this batch before generation starts.</div>
                </div>
                <Badge>Universal</Badge>
              </div>
              <div className="grid gap-2.5 md:grid-cols-3">
                <label className="grid gap-1">
                  <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Model</span>
                  <select
                    className="h-9 rounded-none border border-neutral-800 bg-black px-3 font-sans text-[11px] text-neutral-100 outline-none transition-colors focus:border-neutral-600"
                    value={imageSettings.model || "nano_banana_pro"}
                    onChange={(event) => actions.setImageModel?.(event.target.value)}
                    disabled={!!state?.running || startingBatch || stoppingBatch}
                  >
                    {IMAGE_MODEL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1">
                  <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Images / prompt</span>
                  <select
                    className="h-9 rounded-none border border-neutral-800 bg-black px-3 font-sans text-[11px] text-neutral-100 outline-none transition-colors focus:border-neutral-600"
                    value={String(imageSettings.outputCount || 2)}
                    onChange={(event) => actions.setImageOutputCount?.(Number(event.target.value))}
                    disabled={!!state?.running || startingBatch || stoppingBatch}
                  >
                    {IMAGE_OUTPUT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <span className="text-[10px] leading-4 text-neutral-600">Number of images to generate for each prompt.</span>
                </label>
                <label className="grid gap-1">
                  <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Aspect ratio</span>
                  <select
                    className="h-9 rounded-none border border-neutral-800 bg-black px-3 font-sans text-[11px] text-neutral-100 outline-none transition-colors focus:border-neutral-600"
                    value={imageSettings.aspectRatio || "crop_16_9"}
                    onChange={(event) => actions.setImageAspectRatio?.(event.target.value)}
                    disabled={!!state?.running || startingBatch || stoppingBatch}
                  >
                    {IMAGE_ASPECT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>
            </Card>
          ) : (
            <Card className="p-3">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">Text-to-video settings</div>
                  <div className="mt-0.5 text-[11px] text-neutral-500">These settings apply only to prompt-to-video batches from Create.</div>
                </div>
                <Badge>Prompt to video</Badge>
              </div>
              <div className="grid gap-2.5 md:grid-cols-3">
                <label className="grid gap-1">
                  <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Model</span>
                  <select
                    className="h-9 rounded-none border border-neutral-800 bg-black px-3 font-sans text-[11px] text-neutral-100 outline-none transition-colors focus:border-neutral-600"
                    value={videoSettings.model || "veo_3_1_quality"}
                    onChange={(event) => actions.setVideoModel?.(event.target.value)}
                    disabled={!!state?.running || startingBatch || stoppingBatch}
                  >
                    {VIDEO_MODEL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1">
                  <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Videos / prompt</span>
                  <select
                    className="h-9 rounded-none border border-neutral-800 bg-black px-3 font-sans text-[11px] text-neutral-100 outline-none transition-colors focus:border-neutral-600"
                    value={String(videoSettings.outputCount || 1)}
                    onChange={(event) => actions.setVideoOutputCount?.(Number(event.target.value))}
                    disabled={!!state?.running || startingBatch || stoppingBatch}
                  >
                    {VIDEO_OUTPUT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <span className="text-[10px] leading-4 text-neutral-600">Prompt-to-video runs live here. Image-to-video still starts from Gallery.</span>
                </label>
                <label className="grid gap-1">
                  <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Aspect ratio</span>
                  <select
                    className="h-9 rounded-none border border-neutral-800 bg-black px-3 font-sans text-[11px] text-neutral-100 outline-none transition-colors focus:border-neutral-600"
                    value={videoSettings.aspectRatio || "crop_16_9"}
                    onChange={(event) => actions.setVideoAspectRatio?.(event.target.value)}
                    disabled={!!state?.running || startingBatch || stoppingBatch}
                  >
                    {VIDEO_ASPECT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </div>
            </Card>
          )}
        </>
      )}

      {createMode === "image" ? (
        <Card className="p-3">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">Scene continuity</div>
              <div className="mt-0.5 text-[11px] text-neutral-500">
                Later scenes can reference an earlier generated scene. Batch Gen will add that earlier result to the Flow prompt before typing the new scene prompt.
              </div>
            </div>
            <Badge>Optional</Badge>
          </div>
          {imageScenes.length > 1 ? (
            <div className={cn("grid gap-2.5", imageScenes.length > 4 ? "max-h-80 overflow-y-auto pr-1" : "")}>
              {imageScenes.slice(1).map((scenePrompt, index) => {
                const sceneNumber = index + 2;
                const selectedSource = Number(continuityMap[String(sceneNumber)] || 0);
                return (
                  <div key={sceneNumber} className="grid gap-1.5 border border-neutral-900 bg-black/40 p-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                          Scene {String(sceneNumber).padStart(2, "0")}
                        </div>
                        <div className="mt-1 text-[11px] leading-5 text-neutral-200">
                          {summarizeScenePrompt(scenePrompt)}
                        </div>
                      </div>
                      <Badge tone={selectedSource ? "warn" : "muted"}>
                        {selectedSource ? `Ref Scene ${String(selectedSource).padStart(2, "0")}` : "No ref"}
                      </Badge>
                    </div>
                    <label className="grid gap-1">
                      <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Reference earlier scene</span>
                      <select
                        className="h-9 rounded-none border border-neutral-800 bg-black px-3 font-sans text-[11px] text-neutral-100 outline-none transition-colors focus:border-neutral-600"
                        value={String(selectedSource)}
                        onChange={(event) => actions.setImageContinuityLink?.(sceneNumber, Number(event.target.value))}
                        disabled={!!state?.running || startingBatch || stoppingBatch}
                      >
                        <option value="0">None</option>
                        {imageScenes.slice(0, sceneNumber - 1).map((previousPrompt, previousIndex) => {
                          const sourceSceneNumber = previousIndex + 1;
                          return (
                            <option key={sourceSceneNumber} value={sourceSceneNumber}>
                              {`Scene ${String(sourceSceneNumber).padStart(2, "0")} — ${summarizeScenePrompt(previousPrompt, 40)}`}
                            </option>
                          );
                        })}
                      </select>
                    </label>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="border border-neutral-900 bg-black/40 px-3 py-2.5 text-[11px] leading-5 text-neutral-500">
              Add at least two image scenes and the continuity map will appear here.
            </div>
          )}
        </Card>
      ) : null}

      {createMode === "image" ? (
      <Card className="p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">Character reference</div>
          <Badge>Optional</Badge>
        </div>
        <label className="mb-2 flex items-center gap-2 text-[11px] text-neutral-200">
          <input
            type="checkbox"
            checked={!!state?.characterConsistencyEnabled}
            onChange={(event) => actions.setConsistency(event.target.checked)}
          />
          Use this reference every scene
        </label>
        {state?.characterImage?.dataUrl ? (
          !!state?.characterConsistencyEnabled ? (
            <div className="mb-2.5 border border-neutral-900 bg-black/40 px-3 py-2.5 text-[11px] leading-5 text-neutral-500">
              Batch Gen will keep the character anchor on every scene. If a scene also references an earlier generated scene, both references will be attached before the prompt is submitted.
            </div>
          ) : imageScenes.length > 1 ? (
            <div className="mb-2.5 grid gap-2">
              <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Choose extra anchor scenes</div>
              <div className={cn("grid gap-2", imageScenes.length > 4 ? "max-h-72 overflow-y-auto pr-1" : "")}>
                <div className="flex items-start justify-between gap-3 border border-neutral-900 bg-black/40 p-2.5">
                  <div>
                    <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                      Scene 01
                    </div>
                    <div className="mt-1 text-[11px] leading-5 text-neutral-200">
                      {summarizeScenePrompt(imageScenes[0])}
                    </div>
                  </div>
                  <Badge tone="active">Anchor</Badge>
                </div>
                {imageScenes.slice(1).map((scenePrompt, index) => {
                  const sceneNumber = index + 2;
                  const selected = !!characterReferenceSceneMap[String(sceneNumber)];
                  return (
                    <label
                      key={sceneNumber}
                      className="flex items-start justify-between gap-3 border border-neutral-900 bg-black/40 p-2.5"
                    >
                      <div className="min-w-0">
                        <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                          Scene {String(sceneNumber).padStart(2, "0")}
                        </div>
                        <div className="mt-1 text-[11px] leading-5 text-neutral-200">
                          {summarizeScenePrompt(scenePrompt)}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge tone={selected ? "warn" : "muted"}>
                          {selected ? "Anchor" : "Off"}
                        </Badge>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(event) => actions.setCharacterReferenceScene?.(sceneNumber, event.target.checked)}
                          disabled={!!state?.running || startingBatch || stoppingBatch}
                        />
                      </div>
                    </label>
                  );
                })}
              </div>
              <div className="text-[10px] leading-4 text-neutral-600">
                Scene 01 always uses the uploaded character reference. Turn on <span className="text-neutral-400">Use this reference every scene</span> to anchor the whole batch automatically.
              </div>
            </div>
          ) : (
            <div className="mb-2.5 border border-neutral-900 bg-black/40 px-3 py-2.5 text-[11px] leading-5 text-neutral-500">
              Add at least two image scenes if you want to choose extra scenes for the character anchor. Scene 01 will still use the uploaded reference.
            </div>
          )
        ) : null}
        <div className="grid gap-2.5 md:grid-cols-[1fr_auto]">
          <button
            type="button"
            className="flex min-h-[84px] items-center justify-center rounded-none border border-dashed border-neutral-800 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-3 text-[11px] text-neutral-500 transition-colors hover:border-neutral-700 hover:text-neutral-300"
            onClick={() => actions.pickCharacterImage()}
          >
            {state?.characterImage?.dataUrl ? "Change reference image" : "Drop image or click to choose"}
          </button>
          {state?.characterImage?.dataUrl ? (
            <Card className="flex items-center gap-2 p-2.5">
              <img
                src={state.characterImage.dataUrl}
                alt={state.characterImage.name || "Reference"}
                className="h-12 w-12 rounded-none border border-neutral-900 object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-sans text-[10px] text-neutral-200">{state.characterImage.name || "reference.jpg"}</div>
                <div className="mt-0.5 text-[10px] text-neutral-500">Ready</div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => actions.clearCharacterImage()} loading={clearingReference} disabled={clearingReference}>
                {clearingReference ? "Removing" : "Remove"}
              </Button>
            </Card>
          ) : null}
        </div>
      </Card>
      ) : null}

      <Card className="overflow-hidden p-3">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">Studio run</div>
            <div className="mt-0.5 text-[12px] text-neutral-200">{state?.runStatusText || state?.lastStatusText || "Ready"}</div>
          </div>
          <Badge tone={badgeTone}>{badgeLabel}</Badge>
        </div>
        <div className="mb-2.5 grid gap-1.5">
          <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            <span>{state?.runState?.currentStep || "Idle"}</span>
            <span>{totalScenes ? `${displayedCount} / ${totalScenes}` : "0 / 0"}</span>
          </div>
          <Progress value={displayedCount} max={totalScenes || 1} />
          {waitPreview ? (
            <div className="flex items-center justify-between gap-3 rounded-none border border-amber-500/20 bg-amber-500/8 px-3 py-2">
              <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-amber-300">Waiting</div>
              <div className="font-sans text-[12px] text-amber-100">{waitPreview.replace(/^Next scene in /i, "").replace(/…$/, "")}</div>
            </div>
          ) : null}
          {runPhase === "finalizing" ? (
            <div className="flex items-center gap-2 rounded-none border border-neutral-200 bg-neutral-100 px-3 py-2">
              <Spinner className="h-3.5 w-3.5 text-neutral-200" />
              <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-300">Finalizing gallery</div>
            </div>
          ) : null}
          <div className={cn("text-[11px] leading-5", waitPreview ? "text-neutral-600" : "text-neutral-500")}>
            {state?.runState?.currentPreview || "Ready to run your next batch."}
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => actions.start()} disabled={createVideoLocked || state?.running || state?.entitlement?.kind === "free_exhausted" || startingBatch || stoppingBatch} loading={startingBatch && !createVideoLocked}>
            {createVideoLocked ? "Coming soon" : (startingBatch ? "Starting" : "Start")}
          </Button>
          <Button className="flex-1" variant="secondary" onClick={() => actions.stop()} disabled={(!state?.running && !stoppingBatch) || startingBatch} loading={stoppingBatch}>
            {stoppingBatch ? "Stopping" : "Stop"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function MediaGrid({ items = [], emptyTitle, emptyCopy, actionLabel, onPrimary, onClear, clearLabel = "Clear", videos = false, primaryLoading = false, clearLoading = false, onPreview }) {
  return (
    <div className="space-y-2.5">
      <Card className="p-3">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">This session</div>
            <div className="mt-0.5 text-[11px] text-neutral-500">
              Downloads save into <span className="font-sans text-neutral-300">{videos ? "Batch Gen/Videos/" : "Batch Gen/"}</span>
            </div>
          </div>
          <Badge>{items.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" onClick={onPrimary} loading={primaryLoading} disabled={primaryLoading || clearLoading}>
            {actionLabel}
          </Button>
          <Button size="sm" className="flex-1" variant="secondary" onClick={onClear} loading={clearLoading} disabled={clearLoading || primaryLoading}>
            {clearLabel}
          </Button>
        </div>
      </Card>

      {!items.length ? (
        <Card className="p-5 text-center">
          <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-500">{emptyTitle}</div>
          <div className="mt-2 text-[12px] leading-5 text-neutral-500">{emptyCopy}</div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <Card key={item.id || item.filename} className="group overflow-hidden">
              <button
                type="button"
                className="relative block aspect-square w-full bg-black text-left"
                onClick={() => {
                  if (item?.url && onPreview) {
                    onPreview(
                      item.url,
                      (item.filename || "").split("/").pop() || `scene-${item.sceneNumber || item.sourceSceneNumber || 0}`,
                    );
                  }
                }}
                disabled={!item?.url || !onPreview}
              >
                {videos ? (
                  item.url ? (
                    <video className="h-full w-full object-cover" preload="metadata" muted playsInline src={item.url} />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[11px] text-neutral-600">Processing</div>
                  )
                ) : (
                  <img className="h-full w-full object-cover" src={item.url} alt={item.filename || "Generated"} />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                <div className="absolute left-2 top-2 rounded-none border border-neutral-700 bg-black/80 px-2 py-1 font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-200">
                  {videos ? "Video" : "Image"}
                </div>
              </button>
              <div className="space-y-1 p-2.5">
                <div className="truncate font-sans text-[10px] text-neutral-200">
                  {(item.filename || "").split("/").pop() || `scene-${item.sceneNumber || item.sourceSceneNumber || 0}`}
                </div>
                <div className="text-[10px] text-neutral-500">
                  {videos
                    ? `Scene ${String(item.sourceSceneNumber || 0).padStart(2, "0")}`
                    : `Scene ${String(item.sceneNumber || 0).padStart(2, "0")}`}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountTab({ state, actions }) {
  const entitlement = formatEntitlement(state?.entitlement);
  const auth = state?.auth || {};
  const accountStatus = state?.accountStatus || {};
  const guestMode = !!auth?.me?.guestMode;
  const signedIn = !!auth.session && !guestMode;
  const hydratingAccount = !!auth.hydrating && !signedIn;
  const subscribed = state?.entitlement?.kind === "subscribed";
  const exhausted = state?.entitlement?.kind === "free_exhausted";
  const signingInWithGoogle = !!auth.signingInWithGoogle;
  const cancelingAtPeriodEnd = !!auth?.me?.cancelAtPeriodEnd;
  const currentPeriodEnd = auth?.me?.currentPeriodEnd
    ? new Date(auth.me.currentPeriodEnd).toLocaleDateString()
    : "";
  const billingPortalAvailable = auth?.me?.billingPortalAvailable !== false;
  const busyLabel = String(state?.uiBusy?.label || "").toLowerCase();
  const openingCheckout = busyLabel.includes("opening checkout");
  const openingBilling = busyLabel.includes("opening billing");
  const deletingAccount = busyLabel.includes("deleting account");
  const refreshingAccount = busyLabel.includes("refreshing account");
  const accountStatusTone = accountStatus?.variant === "error"
    ? "border-red-500/25 bg-red-500/8 text-red-100"
    : accountStatus?.variant === "ok"
      ? "border-emerald-500/25 bg-emerald-500/8 text-emerald-100"
      : "border-neutral-800 bg-black/40 text-neutral-300";
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">Account</div>
        <Badge tone={signedIn ? "success" : (hydratingAccount ? "warn" : (guestMode ? "active" : "muted"))}>
          {signedIn ? "Signed in" : (hydratingAccount ? "Restoring" : (guestMode ? "Guest" : "Live"))}
        </Badge>
      </div>
      {accountStatus?.text ? (
        <div className={cn("rounded-none border px-3 py-2 text-[11px] leading-5", accountStatusTone)}>
          {accountStatus.text}
        </div>
      ) : null}
      {!subscribed ? (
        <div className="rounded-none border border-neutral-800 bg-neutral-950/75 p-3">
          <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Upgrade</div>
          <div className={cn(
            "upgrade-panel mt-2 overflow-hidden rounded-none border p-4",
            exhausted
              ? "border-neutral-700 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_40%),linear-gradient(180deg,rgba(18,18,20,0.98),rgba(0,0,0,1))]"
              : "border-neutral-800 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_42%),linear-gradient(180deg,rgba(16,16,18,0.96),rgba(0,0,0,1))]",
          )}>
            <div className="upgrade-shimmer" aria-hidden="true" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2">
                <Badge tone={exhausted ? "warn" : "muted"}>{state?.entitlement?.label || "Free"}</Badge>
                <div className="font-sans text-[11px] text-neutral-200">$10/mo</div>
              </div>
              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <div className="font-sans text-[22px] text-neutral-50">{entitlement.meterLabel}</div>
                  <div className="mt-1 text-[11px] leading-5 text-neutral-300">{entitlement.copy}</div>
                </div>
                <div className="rounded-none bg-neutral-900 px-2.5 py-1.5 font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-300">
                  Starter tier
                </div>
              </div>
              <div className="mt-3">
                <Progress value={Number(state?.entitlement?.used || 0)} max={Number(state?.entitlement?.limit || 10)} />
              </div>
              <div className="mt-3 text-[14px] font-semibold tracking-[-0.03em] text-neutral-50">
                Keep the momentum going.
              </div>
              <div className="mt-1.5 text-[11px] leading-5 text-neutral-300">
                Move from the free starter tier into unlimited Batch Gen runs with the same Flow workflow you already have dialed in.
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              className="upgrade-cta flex-1"
              onClick={() => (signedIn ? actions.upgradePlan?.() : actions.signInWithGoogle?.())}
              disabled={subscribed || hydratingAccount}
              loading={signedIn ? openingCheckout : (hydratingAccount || signingInWithGoogle)}
              variant="secondary"
            >
              {signedIn ? "Unlock unlimited" : "Sign in to upgrade"}
            </Button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-[10px] leading-5 text-neutral-500">
              {signedIn
                ? "Checkout opens securely in Stripe and keeps your current Flow workflow exactly the same."
                : (guestMode
                  ? "You’re on the guest free tier right now. Sign in before upgrading so billing stays attached to a real account."
                  : "Sign in first so your upgrade and account state stay synced across sessions.")}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-none border border-emerald-500/20 bg-neutral-950 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Plan</div>
            <Badge tone="success">Batch Gen Pro</Badge>
          </div>
          <div className="space-y-2">
            <div className="text-[13px] text-neutral-100">
              {cancelingAtPeriodEnd && currentPeriodEnd
                ? `Your subscription is active until ${currentPeriodEnd}.`
                : "You’re subscribed and fully unlocked."}
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-none border border-emerald-400/20 bg-emerald-400/8 px-2 py-1 font-sans text-[9px] uppercase tracking-[0.14em] text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
              {cancelingAtPeriodEnd ? "Ends at period close" : "Pro active"}
            </div>
            <div className="text-[11px] leading-5 text-neutral-500">
              {cancelingAtPeriodEnd && currentPeriodEnd
                ? `Cancellation is scheduled. You can still use Pro features until ${currentPeriodEnd}.`
                : "Billing is active on this account. You can manage or cancel your subscription from the billing portal."}
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-2.5">
          <Card className="p-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Sign-in</div>
            {!signedIn ? (
              <>
                <div className="mt-1.5 text-[11px] leading-5 text-neutral-500">
                  {hydratingAccount
                    ? "Restoring your saved account session. This usually takes a moment."
                    : (guestMode
                      ? "You’re currently using the guest free tier. Sign in with Google to sync upgrades, billing, and account access."
                      : "Sign in with Google for the fastest start. You still get 10 free generations every 24 hours.")}
                </div>
                <Button
                  className="mt-3 w-full"
                  onClick={() => actions.signInWithGoogle?.()}
                  disabled={hydratingAccount || signingInWithGoogle}
                  loading={hydratingAccount || signingInWithGoogle}
                >
                  {!hydratingAccount && !signingInWithGoogle ? <IconGoogle className="h-4 w-4" /> : null}
                  {hydratingAccount ? "Restoring account…" : (signingInWithGoogle ? "Opening Google…" : "Continue with Google")}
                </Button>
                <div className="mt-2.5">
                  <Button className="w-full" variant="secondary" onClick={() => actions.refreshAuth?.()} disabled={hydratingAccount || !!auth.loading || signingInWithGoogle} loading={hydratingAccount || !!auth.loading || refreshingAccount}>
                    {hydratingAccount ? "Restoring…" : (auth.loading ? "Refreshing…" : "Refresh")}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-1.5 text-[11px] leading-5 text-neutral-500">
                  Signed in as <span className="text-neutral-200">{auth?.me?.email || auth?.session?.email || "your account"}</span>.
                </div>
                <div className="mt-3 flex gap-2">
                  <Button className="flex-1" variant="secondary" onClick={() => actions.refreshAuth?.()} disabled={!!auth.loading} loading={!!auth.loading || refreshingAccount}>
                    {auth.loading ? "Refreshing…" : "Refresh"}
                  </Button>
                  {!subscribed ? (
                    <Button className="flex-1" variant="secondary" onClick={() => actions.signOut?.()}>
                      Sign out
                    </Button>
                  ) : null}
                </div>
              </>
            )}
          </Card>
          {subscribed ? (
            <Card className="p-3">
              <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Membership</div>
              <div className="mt-1.5 text-[11px] leading-5 text-neutral-500">
                Manage billing, cancel through the portal, sign out, or permanently delete this account.
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button className="flex-1" variant="secondary" onClick={() => actions.manageBilling?.()} disabled={!signedIn || !billingPortalAvailable} loading={openingBilling}>
                  Manage billing
                </Button>
                <Button className="flex-1" variant="secondary" onClick={() => actions.signOut?.()} disabled={!signedIn}>
                  Sign out
                </Button>
                <Button className="col-span-2 flex-1" variant="danger" onClick={() => actions.deleteAccount?.()} disabled={!signedIn} loading={deletingAccount}>
                  Delete account
                </Button>
              </div>
            </Card>
          ) : null}
      </div>
    </div>
  );
}

function DebugTab({ state, actions }) {
  const debug = state?.debug || {};
  const latestTrace = state?.activeRunTrace || state?.latestRunTrace || null;
  const resetLimitEnabled = !!state?.featureState?.testingTools?.resetLimitEnabled;
  const proModeEnabled = !!state?.featureState?.testingTools?.proModeEnabled;
  const signedIn = !!state?.auth?.session && !state?.auth?.me?.guestMode;
  const subscribed = ["active", "trialing"].includes(String(state?.auth?.me?.subscriptionStatus || "").toLowerCase());
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        {[
          ["Ingredients", debug.ingredients || "0"],
          ["Mode", debug.flowMode || "-"],
          ["Last submit", debug.lastSubmit || "Waiting"],
          ["Last status", debug.lastStatus || "Waiting"],
        ].map(([label, value]) => (
          <Card key={label} className="p-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">{label}</div>
            <div className="mt-1.5 text-[11px] leading-5 text-neutral-200">{value}</div>
          </Card>
        ))}
      </div>
      <Card className="p-3">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">Debug log</div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => actions.runCompatibilityCheck?.()}>
              Compat check
            </Button>
            <Button variant="secondary" size="sm" onClick={() => actions.copyDiagnosticReport?.()}>
              Copy report
            </Button>
            <Button variant="secondary" size="sm" onClick={() => actions.copyRunTrace?.()}>
              Copy trace
            </Button>
            <Button variant="secondary" size="sm" onClick={() => actions.copyStatus()}>
              Copy status
            </Button>
          </div>
        </div>
        <div className="mb-2.5 rounded-none border border-red-500/30 bg-[linear-gradient(180deg,rgba(68,10,10,0.42),rgba(24,0,0,0.82))] p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-red-200">Clear local cache</div>
              <div className="mt-1 text-[12px] leading-5 text-red-100">
                Use this if the popup gets stuck, gallery/session previews look wrong, or local debug state needs a clean reset.
              </div>
              <div className="mt-1 text-[10px] leading-4 text-red-100/75">
                This clears only local popup caches on this device. It does not reset your backend free quota, guest usage, or subscription state.
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => actions.resetUi()}
            >
              Clear cache
            </Button>
          </div>
        </div>
        {resetLimitEnabled ? (
          <div className="mb-2.5 rounded-none border border-amber-500/30 bg-[linear-gradient(180deg,rgba(82,45,0,0.38),rgba(30,16,0,0.82))] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-amber-200">Reset free limit</div>
                <div className="mt-1 text-[12px] leading-5 text-amber-100">
                  Testing only. This clears the current 24-hour free usage window for the active guest/account context so you can re-test quota behaviour.
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                className="whitespace-nowrap border-amber-500/40 bg-amber-500/12 text-amber-50 hover:bg-amber-500/22"
                onClick={() => actions.resetFreeLimit?.()}
              >
                Reset limit
              </Button>
            </div>
          </div>
        ) : null}
        {proModeEnabled ? (
          <div className="mb-2.5 rounded-none border border-blue-500/30 bg-[linear-gradient(180deg,rgba(12,28,74,0.36),rgba(4,10,28,0.82))] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-blue-200">Test Pro mode</div>
                <div className="mt-1 text-[12px] leading-5 text-blue-100">
                  Testing only. Toggle the current signed-in account between free and Pro without going through Stripe checkout.
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="whitespace-nowrap border-blue-500/40 bg-blue-500/12 text-blue-50 hover:bg-blue-500/22"
                  disabled={!signedIn || subscribed}
                  onClick={() => actions.setTestPlan?.("pro")}
                >
                  Enable Pro
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="whitespace-nowrap border-neutral-700 bg-neutral-900 text-neutral-100 hover:bg-neutral-800"
                  disabled={!signedIn || !subscribed}
                  onClick={() => actions.setTestPlan?.("free")}
                >
                  Set Free
                </Button>
              </div>
            </div>
          </div>
        ) : null}
        <div className="mb-2.5 rounded-none border border-neutral-800 bg-black p-3">
          <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Recent runs</div>
          <div className="mt-2 space-y-1">
            {(state?.recentRuns || []).slice(-3).reverse().map((run, index) => (
              <div key={`${run.at || "run"}-${index}`} className="flex items-center justify-between gap-3 text-[10px] text-neutral-400">
                <span>{run.errorCode || "ok"}</span>
                <span>{run.total || 0} scenes</span>
                <span>{run.lastStage || run.blockedReason || "None"}</span>
              </div>
            ))}
            {!(state?.recentRuns || []).length ? <div className="text-[10px] text-neutral-600">No recent run history yet.</div> : null}
          </div>
        </div>
        <div className="mb-2.5 rounded-none border border-neutral-800 bg-black p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="font-sans text-[10px] uppercase tracking-[0.14em] text-neutral-500">Latest trace</div>
            <Badge tone={latestTrace?.status === "error" ? "danger" : latestTrace?.status === "ok" ? "success" : "muted"}>
              {latestTrace?.status || "idle"}
            </Badge>
          </div>
          {latestTrace ? (
            <>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-neutral-400">
                <div>Kind: <span className="text-neutral-200">{latestTrace.kind || "-"}</span></div>
                <div>Error: <span className="text-neutral-200">{latestTrace.errorCode || "ok"}</span></div>
                <div>Stage: <span className="text-neutral-200">{latestTrace.lastStage || "-"}</span></div>
                <div>Events: <span className="text-neutral-200">{(latestTrace.events || []).length}</span></div>
              </div>
              <div className="mt-2 max-h-[220px] space-y-1 overflow-auto border border-neutral-900 bg-neutral-950/70 p-2">
                {(latestTrace.events || []).slice(-8).map((event, index) => (
                  <div key={`${event.at || "trace"}-${index}`} className="border border-neutral-900 bg-black/40 px-2 py-1.5 text-[10px] leading-5 text-neutral-400">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-sans uppercase tracking-[0.12em] text-neutral-500">{event.stage || "event"}</span>
                      <span
                        className={cn(
                          "font-sans uppercase tracking-[0.12em]",
                          event.status === "error"
                            ? "text-red-300"
                            : event.status === "ok"
                              ? "text-emerald-300"
                              : "text-neutral-500",
                        )}
                      >
                        {event.status || "info"}
                      </span>
                    </div>
                    <div className="mt-1 text-neutral-500">{event.errorCode || "no error code"}</div>
                    {event.data ? (
                      <pre className="mt-1 overflow-auto whitespace-pre-wrap break-words text-[10px] text-neutral-500">
                        {JSON.stringify(event.data, null, 2)}
                      </pre>
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-2 text-[10px] text-neutral-600">Run a batch and the latest stage trace will appear here.</div>
          )}
        </div>
        <pre className="max-h-[260px] overflow-auto rounded-none border border-neutral-800 bg-black p-3 font-sans text-[10px] leading-5 text-neutral-400">
          {(state?.debugLines || []).join("\n") || "Waiting for debug output..."}
        </pre>
      </Card>
    </div>
  );
}

function ActionsDialog({ open, onClose, actions, state }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(245,245,245,0.76)] backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-sm p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-neutral-400">Quick actions</div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="grid gap-2">
          <Button onClick={() => { actions.start(); onClose(); }} disabled={state?.running || state?.entitlement?.kind === "free_exhausted"}>
            Start batch
          </Button>
          <Button variant="secondary" onClick={() => { actions.stop(); onClose(); }} disabled={!state?.running}>
            Stop batch
          </Button>
          <Button variant="secondary" onClick={() => { actions.downloadAllImages(); onClose(); }}>
            Download ZIP
          </Button>
          <Button variant="secondary" onClick={() => { actions.clearGallery(); onClose(); }}>
            Clear gallery
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function PopupApp() {
  const state = useBridgeState();
  const [actionsOpen, setActionsOpen] = useState(false);
  const actions = bridge()?.actions || {};
  const busyLabel = String(state?.uiBusy?.label || "").toLowerCase();
  const preparingDownloads = busyLabel.includes("preparing downloads") || busyLabel.includes("preparing zip");
  const clearingGallery = busyLabel.includes("clearing gallery");
  const preparingVideoDownloads = busyLabel.includes("preparing video downloads");
  const clearingVideos = busyLabel.includes("clearing videos");

  const tabs = useMemo(() => {
    const baseTabs = [
      { value: "batch", label: "Create" },
      { value: "gallery", label: "Gallery" },
      { value: "account", label: "Account" },
      { value: "debug", label: "Debug" },
    ];
    if ((state?.liveVideos || []).length > 0) {
      baseTabs.splice(2, 0, { value: "videos", label: "Videos" });
    }
    return baseTabs;
  }, [state?.liveVideos]);

  const activeTab = tabs.some((tab) => tab.value === state?.activeTab) ? state?.activeTab : "batch";

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-6 text-neutral-500">
        Loading Batch Gen…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <div className="flex min-h-screen w-full flex-col gap-2.5 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_38%),linear-gradient(180deg,#050505_0%,#000_100%)] px-3 py-3">
        <Header state={state} onOpenActions={() => setActionsOpen(true)} onOpenAccount={() => actions.setTab?.("account")} />
        <Tabs tabs={tabs} active={activeTab} onChange={(tab) => actions.setTab?.(tab)} />
        {activeTab === "batch" ? <EntitlementStrip state={state} actions={actions} /> : null}
        {state?.flowBanner?.visible ? (
          <Card className="border-red-500/20 bg-red-500/12 p-2.5 text-[11px] text-red-100">
            {state.flowBanner.text}
          </Card>
        ) : null}

        <div className="overflow-x-hidden pb-2">
          {activeTab === "batch" && <BatchTab state={state} actions={actions} />}
          {activeTab === "gallery" && (
            <MediaGrid
              items={state.liveThumbnails}
              emptyTitle="No previews yet"
              emptyCopy="Run a batch and completed scenes will appear here as square previews."
              actionLabel="Download ZIP"
              onPrimary={() => actions.downloadAllImages()}
              onClear={() => actions.clearGallery()}
              primaryLoading={preparingDownloads}
              clearLoading={clearingGallery}
              onPreview={(src, label) => actions.openPreview?.(src, label)}
            />
          )}
          {activeTab === "videos" && (
            <MediaGrid
              items={state.liveVideos}
              emptyTitle="No videos yet"
              emptyCopy="Existing video results will appear here, but new video generation is still coming soon."
              actionLabel="Download all"
              onPrimary={() => actions.downloadAllVideos?.()}
              onClear={() => actions.clearVideos?.()}
              videos
              primaryLoading={preparingVideoDownloads}
              clearLoading={clearingVideos}
              onPreview={(src, label) => actions.openPreview?.(src, label)}
            />
          )}
          {activeTab === "account" && <AccountTab state={state} actions={actions} />}
          {activeTab === "debug" && <DebugTab state={state} actions={actions} />}
        </div>
      </div>
      <ActionsDialog open={actionsOpen} onClose={() => setActionsOpen(false)} actions={actions} state={state} />
      <CommandPaletteOverlay palette={state?.commandPalette} actions={actions} />
      <PreviewLightboxOverlay preview={state?.previewLightbox} actions={actions} />
      <ConfirmOverlay confirm={state?.confirm} actions={actions} />
      <BusyOverlay busy={state?.uiBusy} />
      <ToastViewport toasts={state?.uiToasts || []} />
    </div>
  );
}
