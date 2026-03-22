// ── Big Sur Color Palette ──
// Inspired by the view from Big Sur at sunset:
// deep forest greens, ocean teals, warm sand, driftwood,
// and sunset accents of coral, pink, and soft purple.

export const colors = {
  // Primary — blue-teal (real ocean teal, not green)
  deepTeal:     '#0e7490',   // deep ocean teal — buttons, active states
  oceanTeal:    '#0891b2',   // bright ocean teal — hover
  tealDark:     '#155e75',   // darker teal — headings on light bg

  // Text — black based (not green)
  ink:          '#1f2937',   // near-black — primary text, headings
  graphite:     '#374151',   // dark gray — body text
  slate:        '#6b7280',   // medium gray — labels, secondary
  silver:       '#9ca3af',   // light gray — placeholders

  // Sand & warmth
  sand:         '#f5f0e8',   // warm sand — card backgrounds
  driftwood:    '#e8e0d4',   // driftwood — borders
  warmGray:     '#d4cdc2',   // warm gray — subtle borders
  shell:        '#faf7f2',   // shell white — card backgrounds

  // Tinted backgrounds
  paleSage:     '#eaf2ee',   // pale sage — page background
  softTeal:     '#e0f0f0',   // soft teal — alt sections

  // Accents
  softPink:     '#d4a0a0',   // soft pink — gentle accent
  duskPurple:   '#8b7ba4',   // dusk purple — subtle accent
  goldenHour:   '#c9a86c',   // golden hour — warm highlight

  // Workbook (B&W print-safe)
  mist:         '#d1d5db',   // very light gray — borders on workbook
  white:        '#ffffff',
};

// Semantic aliases for common uses
export const theme = {
  // Page chrome (outside the workbook)
  pageBg:           colors.paleSage,
  cardBg:           colors.shell,
  cardBorder:       colors.driftwood,
  cardBorderActive: colors.deepTeal,

  // Text — black/dark, not green
  textPrimary:      colors.ink,
  textSecondary:    colors.graphite,
  textMuted:        colors.slate,
  textPlaceholder:  colors.silver,

  // Interactive — blue-teal buttons
  buttonBg:         colors.deepTeal,
  buttonText:       colors.white,
  buttonHover:      colors.oceanTeal,
  buttonOutline:    colors.driftwood,
  pillActive:       colors.deepTeal,
  pillInactive:     colors.driftwood,

  // Accents
  accentSoft:       colors.softPink,
  accentPurple:     colors.duskPurple,
  accentGold:       colors.goldenHour,

  // Workbook page (stays B&W for printing)
  workbookText:     colors.ink,
  workbookBorder:   colors.mist,
  workbookBg:       colors.white,

  // Nav
  navBg:            colors.white,
  navBorder:        colors.driftwood,

  // Section backgrounds
  sectionAlt:       colors.softTeal,
};
