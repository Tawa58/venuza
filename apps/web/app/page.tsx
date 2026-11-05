import { glassGlow, type GlassGlowName } from "@venuza/design-tokens";
import { Sparkles } from "lucide-react";
import { FirebaseClientStatus } from "@/components/firebase-client-status";
import { cn } from "@/lib/utils";

const labels: Record<GlassGlowName, string> = {
  main: "Main",
  secondary: "Secondary",
  electricViolet: "Electric violet",
  cyan: "Cyan",
  nearWhite: "Near-white",
  mutedGrey: "Muted grey",
};

const colorNames = Object.keys(glassGlow) as GlassGlowName[];

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${glassGlow.electricViolet}, transparent 70%)`,
        }}
      />
      <section
        className={cn(
          "relative w-full max-w-xl rounded-3xl border border-white/10 bg-secondary/80 p-8 shadow-[0_0_80px_-24px] shadow-violet/50 backdrop-blur-xl",
        )}
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet/15 text-violet">
            <Sparkles aria-hidden="true" size={22} />
          </span>
          <div>
            <p className="text-sm tracking-[0.22em] text-cyan uppercase">Glass Glow</p>
            <h1 className="text-4xl font-semibold tracking-tight">Venuza</h1>
          </div>
        </div>
        <p className="text-lg text-muted">Discover. Connect. Experience.</p>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {colorNames.map((name) => (
            <li key={name} className="rounded-2xl border border-white/10 bg-main/40 p-3">
              <span
                className="mb-3 block h-10 rounded-xl border border-white/10"
                style={{ backgroundColor: glassGlow[name] }}
              />
              <span className="block text-sm">{labels[name]}</span>
              <span className="font-mono text-xs text-muted">{glassGlow[name]}</span>
            </li>
          ))}
        </ul>
        <FirebaseClientStatus />
      </section>
    </main>
  );
}
