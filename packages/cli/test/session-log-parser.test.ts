import { describe, expect, it } from 'bun:test'
import { LogParser, parseSession } from '../src/index'

const SAMPLE_SESSION = `{"type":"session","version":3,"id":"test-session","timestamp":"2026-02-17T23:02:38.146Z","cwd":"/home/test"}
{"type":"message","id":"msg1","parentId":null,"timestamp":"2026-02-17T23:02:38.166Z","message":{"role":"user","content":[{"type":"text","text":"Hello"}]}}
{"type":"message","id":"msg2","parentId":"msg1","timestamp":"2026-02-17T23:02:52.044Z","message":{"role":"assistant","content":[{"type":"text","text":"Hi there!"},{"type":"toolCall","id":"call1","name":"write","arguments":{"file_path":"/test.md","content":"test"}}]}}
{"type":"message","id":"msg3","parentId":"msg2","timestamp":"2026-02-17T23:02:52.110Z","message":{"role":"toolResult","toolCallId":"call1","toolName":"write","content":[{"type":"text","text":"Success"}],"isError":false}}
{"type":"message","id":"msg4","parentId":"msg3","timestamp":"2026-02-17T23:02:59.603Z","message":{"role":"assistant","content":[{"type":"thinking","thinking":"Thinking process","thinkingSignature":"abc123"},{"type":"text","text":"Final response"}]}}
`

describe('LogParser', () => {
  it('should parse session meta', () => {
    const parser = new LogParser()
    const result = parser.parseContent(SAMPLE_SESSION)

    expect(result.meta.id).toBe('test-session')
    expect(result.meta.version).toBe(3)
    expect(result.meta.cwd).toBe('/home/test')
  })

  it('should parse all messages', () => {
    const parser = new LogParser()
    const result = parser.parseContent(SAMPLE_SESSION)

    expect(result.messages).toHaveLength(4)
  })

  it('should parse user message', () => {
    const parser = new LogParser()
    const result = parser.parseContent(SAMPLE_SESSION)

    const userMsg = result.messages[0]
    expect(userMsg.role).toBe('user')
    expect(userMsg.content).toBe('Hello')
  })

  it('should parse assistant message with tool call', () => {
    const parser = new LogParser()
    const result = parser.parseContent(SAMPLE_SESSION)

    const assistantMsg = result.messages[1]
    expect(assistantMsg.role).toBe('assistant')
    expect(assistantMsg.content).toBe('Hi there!')
    expect(assistantMsg.toolCall).toEqual({
      id: 'call1',
      name: 'write',
      arguments: { file_path: '/test.md', content: 'test' },
    })
  })

  it('should parse tool result', () => {
    const parser = new LogParser()
    const result = parser.parseContent(SAMPLE_SESSION)

    const toolResult = result.messages[2]
    expect(toolResult.role).toBe('toolResult')
    expect(toolResult.toolResult?.toolName).toBe('write')
    expect(toolResult.toolResult?.isError).toBe(false)
  })

  it('should parse thinking when enabled', () => {
    const parser = new LogParser({ includeThinking: true })
    const result = parser.parseContent(SAMPLE_SESSION)

    const msg = result.messages[3]
    expect(msg.thinking).toBe('Thinking process')
  })

  it('should skip thinking when disabled', () => {
    const parser = new LogParser({ includeThinking: false })
    const result = parser.parseContent(SAMPLE_SESSION)

    const msg = result.messages[3]
    expect(msg.thinking).toBeUndefined()
  })

  it('should handle malformed lines gracefully', () => {
    const parser = new LogParser()
    const content = `{"type":"valid"}
invalid json line
{"type":"also valid"}`

    const result = parser.parseContent(content)
    expect(result.messages).toHaveLength(0)
  })

  it('should track parent-child relationships', () => {
    const parser = new LogParser()
    const result = parser.parseContent(SAMPLE_SESSION)

    expect(result.messages[1].parentId).toBe('msg1')
    expect(result.messages[2].parentId).toBe('msg2')
  })
})

describe('parseSession (convenience function)', () => {
  it('should work as convenience function', async () => {
    const result = await parseSession('./packages/cli/test/fixtures/sample-session.jsonl')
    expect(result.meta).toBeDefined()
  })
})
