import type { ParsedSession } from './session-log-parser/index.js'

export interface Platform {
  readonly name: string
  /** Parse JSONL content string into a ParsedSession */
  parse(content: string): ParsedSession
  /** Read a file at filePath and parse it into a ParsedSession */
  parseFile(filePath: string): Promise<ParsedSession>
}
