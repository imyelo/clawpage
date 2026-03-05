export const SVG_THEME = {
  accentColor: '#d4a853',
  mutedColor: '#5c5958',
  textColor: '#e8e6e3',
  bg: '#0a0a0a',
  gridColor: '#1a1a1a',
} as const

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Wraps text into at most `maxLines` lines of at most `maxChars` characters each.
 * Words longer than `maxChars` are hard-truncated. If text is cut short, the last
 * line ends with `...`.
 */
export function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''

  for (let wi = 0; wi < words.length; wi++) {
    const word = words[wi]
    // Hard-truncate a single word that exceeds maxChars
    const w = word.length > maxChars ? `${word.slice(0, maxChars - 1)}\u2026` : word
    const candidate = current ? `${current} ${w}` : w

    if (candidate.length > maxChars) {
      // current is always non-empty here (candidate = w alone never exceeds maxChars)
      if (lines.length === maxLines - 1) {
        // Last available line — commit with ellipsis to signal truncation
        lines.push(`${current.slice(0, maxChars - 3)}...`)
        return lines
      }
      lines.push(current)
      current = w
    } else {
      current = candidate
    }
  }

  if (current) {
    lines.push(current)
  }
  return lines.slice(0, maxLines)
}

/** Shared SVG defs (grid pattern) + background layers + amber accent bar. */
export function buildSvgBase(W: number, H: number): string {
  const { bg, gridColor, accentColor } = SVG_THEME
  return `  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${gridColor}" stroke-width="0.5"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)" opacity="0.6"/>

  <!-- Amber accent bar -->
  <rect x="0" y="0" width="8" height="${H}" fill="${accentColor}"/>`
}
