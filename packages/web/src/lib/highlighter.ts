import { createHighlighter } from 'shiki'

let _highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null

// Lazily initialize a singleton shiki highlighter with common languages
export async function getHighlighter() {
  if (_highlighter) {
    return _highlighter
  }

  _highlighter = await createHighlighter({
    themes: ['vitesse-dark'],
    langs: [
      'bash',
      'sh',
      'shell',
      'javascript',
      'js',
      'jsx',
      'typescript',
      'ts',
      'tsx',
      'python',
      'py',
      'go',
      'rust',
      'rs',
      'markdown',
      'md',
      'html',
      'xml',
      'css',
      'json',
      'yaml',
      'yml',
      'sql',
      'diff',
    ],
  })

  return _highlighter
}
