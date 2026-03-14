import { Marked } from 'marked'

export function parseInlineUiMarkdown(markdown: string): string {
  const marked = new Marked()

  marked.use({
    renderer: {
      link(opt) {
        const titleAttr = opt.title ? ` title="${opt.title}"` : ''
        return `<a href="${opt.href}"${titleAttr} class="layout-footer-link" target="_blank" rel="noopener noreferrer">${opt.text}</a>`
      },
    },
  })

  return marked.parseInline(markdown, { async: false }) as string
}
