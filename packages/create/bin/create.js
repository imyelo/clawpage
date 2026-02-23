#!/usr/bin/env bun
import { cpSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'

const { positionals } = parseArgs({
  options: {
    dir: { type: 'string', short: 'd' },
  },
  allowPositionals: true,
})

const [projectName] = positionals
const targetDir = join(process.cwd(), projectName || 'my-chats-project')

console.log(`Creating project in: ${targetDir}`)

mkdirSync(targetDir, { recursive: true })
mkdirSync(join(targetDir, 'chats'), { recursive: true })

// Copy templates
cpSync(join(import.meta.dir, '../templates/package.json'), join(targetDir, 'package.json'))
cpSync(join(import.meta.dir, '../templates/astro.config.mjs'), join(targetDir, 'astro.config.mjs'))
cpSync(join(import.meta.dir, '../templates/uno.config.ts'), join(targetDir, 'uno.config.ts'))
cpSync(join(import.meta.dir, '../templates/chats/.gitkeep'), join(targetDir, 'chats/.gitkeep'))

// Copy GitHub workflow
const ghWorkflowDir = join(targetDir, '.github/workflows')
mkdirSync(ghWorkflowDir, { recursive: true })
cpSync(join(import.meta.dir, '../templates/.github/workflows/deploy.yml'), join(ghWorkflowDir, 'deploy.yml'))

console.log('Project created!')
console.log(`cd ${projectName || 'my-chats-project'}`)
console.log('bun install')
console.log('bun run dev')
