import { memo, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { AVATAR_COLORS, COLLAPSIBLE_TYPE_STYLES, SPEC_COLOR_MAP } from '../constants/index.js'

// MessageHeader component
export const MessageHeader = memo(function MessageHeader({
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
  if (!isFirstInGroup || !author || !timestamp) {
    return null
  }

  const authorLower = author.toLowerCase()
  const isAgent = authorLower.includes('agent') || authorLower.includes('assistant')

  // Determine avatar colors
  let avatarStyle: { bg: string; text: string } | null = null
  if (avatarColorIndex !== undefined) {
    avatarStyle = AVATAR_COLORS[avatarColorIndex % AVATAR_COLORS.length]
  }

  return (
    <div className="flex items-center gap-2 px-1 mb-3 mt-5">
      <div
        className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-medium font-mono ${
          isAgent ? 'bg-bg-tertiary text-accent ring-1 ring-border' : 'ring-1 ring-border'
        }`}
        style={avatarStyle ? { backgroundColor: avatarStyle.bg, color: avatarStyle.text } : undefined}
      >
        {author.charAt(0).toUpperCase()}
      </div>
      <span className="text-[12px] font-medium text-text-primary tracking-wide font-serif">{author}</span>
      <span
        className="text-[10px] text-text-muted font-mono tracking-tight"
        title={timestamp}
      >
        {timestamp.split(' ').pop()}
      </span>
    </div>
  )
})

// CollapsibleMessage component
export const CollapsibleMessage = memo(function CollapsibleMessage({
  type,
  icon,
  label,
  collapsed = true,
  color,
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
  color?: string
  content: string
  author?: string
  timestamp?: string
  isFirstInGroup?: boolean
  isLastInGroup?: boolean
  avatarColorIndex?: number
}) {
  const [isOpen, setIsOpen] = useState(!collapsed)

  const colors = useMemo(() => {
    const lookupKey = color && SPEC_COLOR_MAP[color] ? color : SPEC_COLOR_MAP[type] ? type : 'default'
    return SPEC_COLOR_MAP[lookupKey] || { borderColor: '#d4a853', color: '#d4a853' }
  }, [color, type])

  const style = useMemo(() => {
    return COLLAPSIBLE_TYPE_STYLES[type] || COLLAPSIBLE_TYPE_STYLES.thinking_level_change
  }, [type])

  return (
    <article
      className={`group flex flex-col w-full ${isLastInGroup ? 'mb-6' : 'mb-3'} ${!isFirstInGroup ? 'mt-3' : ''}`}
    >
      <MessageHeader
        author={author}
        timestamp={timestamp}
        isFirstInGroup={isFirstInGroup}
        avatarColorIndex={avatarColorIndex}
      />
      <div className="w-full min-w-0 max-w-full rounded-sm overflow-hidden bg-bg-secondary/50">
        <div
          className="w-full pl-4 border-l-2 transition-all duration-300 !mb-0 py-1"
          style={{ borderLeftColor: colors.borderColor }}
        >
          <button
            type="button"
            onClick={() => setIsOpen(prev => !prev)}
            className="w-full py-2 flex items-center gap-3 transition-all duration-200 outline-none cursor-pointer rounded-sm"
            style={{ color: style.accent }}
          >
            {icon && <span className="font-mono text-xs w-5 h-5 flex items-center justify-center rounded">{icon}</span>}
            <span className="font-medium text-sm font-serif text-text-primary">{label}</span>
            <span className="ml-auto flex items-center justify-center w-4 h-4 text-text-muted">
              <svg
                className={`w-3.5 h-3.5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="py-3 px-4 pl-9 text-[13px] font-mono leading-relaxed prose prose-sm max-w-none prose-invert prose-p:text-text-secondary prose-strong:text-white prose-strong:font-bold">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
})

// ChatMessage component
export const ChatMessage = memo(function ChatMessage({
  author,
  timestamp,
  content,
  isUser,
  isFirstInGroup = true,
  isLastInGroup = true,
  avatarColorIndex,
}: {
  author: string
  timestamp: string
  content: string
  isUser?: boolean
  isFirstInGroup?: boolean
  isLastInGroup?: boolean
  avatarColorIndex?: number
}) {
  const authorLower = author.toLowerCase()
  const isAgent = isUser !== undefined ? !isUser : authorLower.includes('agent') || authorLower.includes('assistant')

  // Use theme tokens for User vs Agent
  const userClasses = isAgent ? 'bg-msg-assistant-bg ring-msg-assistant-border' : 'bg-msg-user-bg ring-msg-user-border'

  return (
    <article
      className={`group flex flex-col w-full ${isLastInGroup ? 'mb-6' : 'mb-1'} ${!isFirstInGroup ? 'mt-1' : ''}`}
    >
      <MessageHeader
        author={author}
        timestamp={timestamp}
        isFirstInGroup={isFirstInGroup}
        avatarColorIndex={avatarColorIndex}
      />
      <div
        className={`w-full min-w-0 max-w-full rounded-sm px-5 py-3.5 text-text-primary ring-1 font-serif ${userClasses}`}
      >
        <div className="prose prose-sm max-w-none leading-[1.65] text-[13.5px] prose-invert prose-p:text-[#a8a7a5] prose-strong:text-white prose-strong:font-bold">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </article>
  )
})
