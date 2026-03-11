import { memo, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AVATAR_COLORS } from '../constants/index.js'
import dayjs from '../lib/dayjs.js'
import styles from './CollapsibleMessage.module.css'
import '../styles/prose.css'

// Sentinel used to pass [REDACTED] markers through ReactMarkdown as inline code.
const REDACTED_SENTINEL = '__REDACTED__'

function RedactedInline() {
  return (
    <span
      className="redacted-inline"
      role="img"
      aria-label="Redacted content"
      title="This content has been redacted"
    >
      <span
        className="redacted-noise"
        aria-hidden="true"
      />
      <span
        className="redacted-label"
        aria-hidden="true"
      >
        REDACTED
      </span>
    </span>
  )
}

function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Internal MessageHeader — React-only, used exclusively by CollapsibleMessage.
// The Astro version (MessageHeader.astro) serves all static render sites.
function MessageHeader({
  author,
  timestamp,
  isFirstInGroup,
  avatarColorIndex,
}: {
  author?: string
  timestamp?: string
  isFirstInGroup?: boolean
  avatarColorIndex?: number
}) {
  // Render UTC on initial pass (matches SSG build output) to avoid hydration mismatch.
  // useEffect runs only in the browser, updating to the viewer's local timezone after mount.
  // Hooks must be called before the early return to satisfy rules-of-hooks.
  const utcTime = timestamp ? dayjs.utc(timestamp).format('HH:mm') : ''
  const utcTitle = timestamp ? dayjs.utc(timestamp).format('YYYY-MM-DD HH:mm [UTC]') : ''
  const [displayTime, setDisplayTime] = useState(utcTime)
  const [displayTitle, setDisplayTitle] = useState(utcTitle)
  useEffect(() => {
    if (!timestamp) { return }
    setDisplayTime(dayjs.utc(timestamp).local().format('HH:mm'))
    setDisplayTitle(dayjs.utc(timestamp).local().format('YYYY-MM-DD HH:mm'))
  }, [timestamp])

  if (!author || !timestamp) {
    return null
  }

  const authorLower = author.toLowerCase()
  const isAgent = authorLower.includes('agent')

  let avatarStyle: { bg: string; text: string } | null = null
  if (avatarColorIndex !== undefined) {
    avatarStyle = AVATAR_COLORS[avatarColorIndex % AVATAR_COLORS.length]
  }

  return (
    <div
      className={cn(styles.messageHeader, !isFirstInGroup && styles.hiddenHeader)}
      data-header="true"
    >
      <div
        className={cn(styles.avatar, isAgent ? styles.avatarAgent : styles.avatarHuman)}
        style={avatarStyle ? { backgroundColor: avatarStyle.bg, color: avatarStyle.text } : undefined}
      >
        {author.charAt(0).toUpperCase()}
      </div>
      <span className={styles.authorName}>{author}</span>
      <span
        className={styles.authorTimestamp}
        title={displayTitle}
      >
        {displayTime}
      </span>
    </div>
  )
}

export const CollapsibleMessage = memo(function CollapsibleMessage({
  type: _type,
  icon,
  label,
  collapsed = false,
  content,
  author,
  timestamp,
  isFirstInGroup,
  isLastInGroup,
  avatarColorIndex,
}: {
  type: string
  icon: string
  label: string
  collapsed?: boolean
  content: string
  author?: string
  timestamp?: string
  isFirstInGroup?: boolean
  isLastInGroup?: boolean
  avatarColorIndex?: number
}) {
  // Replace [REDACTED] markers with a backtick sentinel so ReactMarkdown
  // produces an inline <code> node we can intercept in the components map.
  const processedContent = content.replace(/\[REDACTED\]/g, `\`${REDACTED_SENTINEL}\``)
  const hasContent = Boolean(content && content.trim() !== '')
  const [isOpen, setIsOpen] = useState(hasContent ? !collapsed : false)

  return (
    <article
      data-author={author}
      data-collapsible="true"
      className={cn(
        styles.collapsible,
        isLastInGroup ? styles.collapsibleLastInGroup : styles.collapsibleNotLastInGroup,
        !isFirstInGroup && styles.collapsibleNotFirstInGroup
      )}
    >
      <MessageHeader
        author={author}
        timestamp={timestamp}
        isFirstInGroup={isFirstInGroup}
        avatarColorIndex={avatarColorIndex}
      />
      <div className={styles.collapsibleWrapper}>
        <div className={styles.collapsibleBorder}>
          <button
            type="button"
            onClick={() => {
              if (hasContent) {
                setIsOpen(prev => !prev)
              }
            }}
            className={cn(styles.collapsibleToggle, !hasContent && styles.collapsibleToggleDisabled)}
            disabled={!hasContent}
            aria-disabled={!hasContent}
          >
            {icon && <span className={styles.collapsibleTypeIcon}>{icon}</span>}
            <span className={styles.collapsibleTypeLabel}>{label}</span>
            {hasContent && (
              <span className={styles.chevronWrapper}>
                <svg
                  className={cn(styles.chevron, isOpen && styles.chevronOpen)}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  role="img"
                  aria-label={isOpen ? 'Collapse' : 'Expand'}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </span>
            )}
          </button>
          <div
            className={cn(
              styles.collapsibleContent,
              isOpen ? styles.collapsibleContentOpen : styles.collapsibleContentClosed
            )}
          >
            {/* .collapsibleBody is the grid item — no padding so it collapses to true 0.
                Padding lives in the inner wrapper to avoid the "blank space" artifact. */}
            <div className={styles.collapsibleBody}>
              <div className={cn(styles.collapsibleBodyInner, 'prose')}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  urlTransform={(url: string) => url}
                  components={{
                    // Intercept inline code nodes that carry the redacted sentinel.
                    // Block fenced code always has a className like "language-xxx";
                    // plain inline code has no className.
                    code: ({ children, className, ...props }) => {
                      if (!className && String(children) === REDACTED_SENTINEL) {
                        return <RedactedInline />
                      }
                      return (
                        <code
                          className={className}
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {processedContent}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
})
