import { describe, expect, it } from 'bun:test'
import type { ParsedSession } from '../src/index'
import { DEFAULT_CONSTRAINT, YAMLGenerator } from '../src/index'

const mockSession: ParsedSession = {
  meta: {
    type: 'session',
    version: 1,
    id: 'test-123',
    timestamp: '2024-01-01T00:00:00Z',
    cwd: '/test',
  },
  messages: [
    {
      id: 'msg-1',
      timestamp: '2024-01-01T00:00:00Z',
      role: 'human',
      content: 'Hello',
    },
    {
      id: 'msg-2',
      timestamp: '2024-01-01T00:01:00Z',
      role: 'agent',
      content: 'Hi there',
      thinking: 'I should respond politely',
    },
    {
      id: 'msg-3',
      timestamp: '2024-01-01T00:02:00Z',
      role: 'agent',
      content: 'Running a command',
      toolCall: { id: 'tc-1', name: 'bash', arguments: { cmd: 'ls' } },
    },
    {
      id: 'msg-4',
      timestamp: '2024-01-01T00:03:00Z',
      role: 'tool',
      content: 'file1.txt\nfile2.txt',
      toolResult: { id: 'tr-1', toolCallId: 'tc-1', result: 'file1.txt\nfile2.txt' },
    },
  ],
  modelChanges: [],
  events: [],
}

const mockSessionWithEvents: ParsedSession = {
  ...mockSession,
  events: [
    { type: 'session', id: 'e1', timestamp: '2024-01-01T00:00:00Z', cwd: '/test' },
    { type: 'model_change', id: 'e2', timestamp: '2024-01-01T00:00:30Z', modelId: 'gpt-4', provider: 'openai' },
  ],
}

const mockSessionWithAllEvents: ParsedSession = {
  ...mockSessionWithEvents,
  events: [
    ...mockSessionWithEvents.events,
    { type: 'compaction', id: 'e3', timestamp: '2024-01-01T00:01:00Z', tokensBefore: 1000 },
    { type: 'custom', id: 'e4', timestamp: '2024-01-01T00:01:30Z', customType: 'test' },
  ],
}

describe('YAMLGenerator excludeProcess', () => {
  it('should exclude thinking when specified', () => {
    const generator = new YAMLGenerator(DEFAULT_CONSTRAINT, {
      excludeProcess: ['thinking'],
    })
    const yaml = generator.generate(mockSession)
    // Thinking content should not appear
    expect(yaml).not.toContain('I should respond politely')
    // But still include the message content
    expect(yaml).toContain('Hi there')
    // Toolcalls should still be present
    expect(yaml).toContain('tool_call')
  })

  it('should exclude toolcalls when specified', () => {
    const generator = new YAMLGenerator(DEFAULT_CONSTRAINT, {
      excludeProcess: ['toolcalls'],
    })
    const yaml = generator.generate(mockSession)
    expect(yaml).not.toContain('tool_call')
  })

  it('should exclude all process when specified', () => {
    const generator = new YAMLGenerator(DEFAULT_CONSTRAINT, {
      excludeProcess: ['all'],
    })
    const yaml = generator.generate(mockSession)
    expect(yaml).not.toContain('thinking')
    expect(yaml).not.toContain('tool_call')
  })

  it('should exclude session events when specified', () => {
    const generator = new YAMLGenerator(DEFAULT_CONSTRAINT, {
      excludeProcess: ['session'],
    })
    const yaml = generator.generate(mockSessionWithEvents)
    expect(yaml).not.toContain('type: session')
  })

  it('should exclude model_change events when specified', () => {
    const generator = new YAMLGenerator(DEFAULT_CONSTRAINT, {
      excludeProcess: ['model_change'],
    })
    const yaml = generator.generate(mockSessionWithEvents)
    expect(yaml).not.toContain('type: model_change')
  })

  it('should exclude toolresults when specified', () => {
    const generator = new YAMLGenerator(DEFAULT_CONSTRAINT, {
      excludeProcess: ['toolresults'],
    })
    const yaml = generator.generate(mockSession)
    // Tool result process entries should not appear (result: field is unique to tool_result)
    expect(yaml).not.toContain('result:')
    // But message content should still be there
    expect(yaml).toContain('Hello')
  })

  it('should exclude compaction events when specified', () => {
    const generator = new YAMLGenerator(DEFAULT_CONSTRAINT, {
      excludeProcess: ['compaction'],
    })
    const yaml = generator.generate(mockSessionWithAllEvents)
    expect(yaml).not.toContain('type: compaction')
  })

  it('should exclude custom events when specified', () => {
    const generator = new YAMLGenerator(DEFAULT_CONSTRAINT, {
      excludeProcess: ['custom'],
    })
    const yaml = generator.generate(mockSessionWithAllEvents)
    expect(yaml).not.toContain('type: custom')
  })
})
