/**
 * Share chat utilities
 */

import fs from 'node:fs'
import path from 'node:path'

export interface ChatMetadata {
  platform: string
  topic: string
  date: string
  messageCount: number
  visibility: 'public' | 'private'
  description: string
}

export interface ChatData extends ChatMetadata {
  slug: string
}

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  const metadata: Record<string, string> = {}
  if (match) {
    const pairs = match[1].split('\n').filter(line => line.includes(':'))
    for (const pair of pairs) {
      const [key, ...valueParts] = pair.split(':')
      if (key && valueParts.length) {
        metadata[key.trim()] = valueParts.join(':').trim()
      }
    }
  }
  return metadata
}

/**
 * Fetch all share chats from chats/
 */
export function getAllChats(): ChatData[] {
  // Go up from packages/web to monorepo root
  const dataDir = path.join(process.cwd(), '..', '..', 'chats')
  if (!fs.existsSync(dataDir)) {
    return []
  }

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.md'))
  return files.map(file => {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8')
    const slug = file.replace('.md', '')
    const metadata = parseFrontmatter(content)

    return {
      slug,
      platform: metadata.platform || '',
      topic: metadata.topic || '',
      date: metadata.date || '',
      messageCount: parseInt(metadata.message_count, 10) || 0,
      visibility: (metadata.visibility as 'public' | 'private') || 'public',
      description: metadata.description || '',
    }
  })
}

/**
 * Filter to only return public chats
 */
export function getPublicChats(): ChatData[] {
  return getAllChats().filter(chat => chat.visibility !== 'private')
}

/**
 * Get chats sorted by date (newest first)
 */
export function getChatsSortedByDate(chats: ChatData[]): ChatData[] {
  return [...chats].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}
