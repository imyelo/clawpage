/**
 * Shared constants for chats-share
 */

// ============================================================================
// CSS class names shared between Astro components and React components
// ============================================================================

// These strings must match the class names used in MessageHeader.astro and
// ChatMessage.astro. Defining them here lets ShowProcessToggle.tsx reference
// the same values without an invisible string contract.
export const CSS_CLASSES = {
  hiddenHeader: 'hidden-header',
  notFirstInGroup: 'not-first-in-group',
} as const

// ============================================================================
// Avatar Color Pool (Professional/Muted Style)
// ============================================================================

export const AVATAR_COLORS: Array<{ bg: string; text: string }> = [
  { bg: '#3b4a5a', text: '#e8eaed' }, // deep blue-gray
  { bg: '#4a3b5a', text: '#e8dae8' }, // deep purple-gray
  { bg: '#3b5a4a', text: '#e8ede8' }, // deep green-gray
  { bg: '#5a4b3a', text: '#ece8e4' }, // deep brown-gray
  { bg: '#5a3b4a', text: '#f5e8e8' }, // deep red-gray
  { bg: '#4a5a3b', text: '#e8f0e8' }, // deep olive-gray
]
