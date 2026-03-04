#!/usr/bin/env node
import { writeFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'
import { DEFAULT_CONSTRAINT } from '../dist/format-constraint/index.js'
import { YAMLGenerator } from '../dist/yaml-generator/index.js'

const PLATFORMS = {
  openclaw: async () => {
    const { OpenClawParser } = await import('../dist/platforms/openclaw.js')
    return new OpenClawParser()
  },
}

const { values, positionals } = parseArgs({
  options: {
    output: { type: 'string', short: 'o' },
    constraint: { type: 'string', short: 'c' },
    'default-show-process': { type: 'boolean', default: false },
    'exclude-process': { type: 'string' },
    platform: { type: 'string', short: 'p', default: 'openclaw' },
  },
  allowPositionals: true,
})

const [command, inputPath] = positionals

const excludeProcess = values['exclude-process']
  ? values['exclude-process'].split(',')
  : []

if (command === 'parse') {
  if (!inputPath) {
    console.error('Usage: openclaw-chats-share parse <session.log> [-o output.yaml] [--platform <name>]')
    process.exit(1)
  }

  const platformName = values.platform || 'openclaw'
  if (!PLATFORMS[platformName]) {
    console.error(`Unknown platform: ${platformName}. Available: ${Object.keys(PLATFORMS).join(', ')}`)
    process.exit(1)
  }

  const parser = await PLATFORMS[platformName]()
  const session = await parser.parseFile(inputPath)

  const generator = new YAMLGenerator(DEFAULT_CONSTRAINT, {
    defaultShowProcess: values['default-show-process'],
    excludeProcess,
  })
  const yaml = generator.generate(session)

  const outputPath = values.output || inputPath.replace('.jsonl', '.yaml')
  await writeFile(outputPath, yaml)

  console.log(`Generated: ${outputPath}`)
} else {
  console.log('Commands: parse <session.log>')
  process.exit(1)
}
