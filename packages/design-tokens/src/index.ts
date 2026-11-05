import palette from "../colors.json";

/**
 * Glass Glow. Electric violet uses the conventional #8F00FF value.
 * The other accents are the cyan, near-white, and muted grey named in the spec.
 */
export const glassGlow = {
  main: palette.main,
  secondary: palette.secondary,
  electricViolet: palette.electricViolet,
  cyan: palette.cyan,
  nearWhite: palette.nearWhite,
  mutedGrey: palette.mutedGrey,
} as const;

export type GlassGlowName = keyof typeof glassGlow;
