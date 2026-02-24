/**
 * Share chat utilities
 */

import fs from 'node:fs'
import path from 'node:path'
import { format } from 'date-fns'
import matter from 'gray-matter'

export interface ChatMetadata {
  title: string
  date: string
  sessionId: string
  channel: string
  model: string
  totalMessages: number
  totalTokens: number
  tags: string[]
  visibility: 'public' | 'private'
  description: string
}

export interface ChatData extends ChatMetadata {
  slug: string
}

export interface ChatWithContent extends ChatData {
  messageBlocks: string[]
}

function getDataDir(): string {
  const workdir = process.env.CHATS_SHARE_WORKDIR ?? path.join(process.cwd(), '..', '..')
  return path.join(workdir, 'chats')
}

/**
 * Fetch all share chats from chats/, including parsed message blocks
 */
export function getAllChatsWithContent(): ChatWithContent[] {
  const dataDir = getDataDir()
  if (!fs.existsSync(dataDir)) {
    return []
  }

  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.md'))
  return files.map(file => {
    const raw = fs.readFileSync(path.join(dataDir, file), 'utf-8')
    const slug = file.replace('.md', '')
    const { data, content } = matter(raw)

    return {
      slug,
      title: data.title || '',
      date: data.date ? format(new Date(data.date), 'yyyy-MM-dd') : '',
      sessionId: data.sessionId || '',
      channel: data.channel || '',
      model: data.model || '',
      totalMessages: parseInt(String(data.totalMessages), 10) || 0,
      totalTokens: parseInt(String(data.totalTokens), 10) || 0,
      tags: Array.isArray(data.tags) ? data.tags : [],
      visibility: (data.visibility as 'public' | 'private') || 'private',
      description: data.description || '',
      messageBlocks: content.split(/\n---\n/).slice(1),
    }
  })
}

/**
 * Fetch all share chats from chats/
 */
export function getAllChats(): ChatData[] {
  return getAllChatsWithContent().map(({ messageBlocks: _, ...chat }) => chat)
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
