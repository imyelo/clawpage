#!/usr/bin/env node
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageDir = dirname(__dirname)

const require = createRequire(import.meta.url)
const astroPkgPath = require.resolve('astro/package.json')
const astroPkgDir = dirname(astroPkgPath)
const astroPkg = JSON.parse(fs.readFileSync(astroPkgPath, 'utf-8'))
const astroBin = join(astroPkgDir, astroPkg.bin.astro)

const { positionals } = parseArgs({
  options: {},
  positionals: ['command'],
  allowPositionals: true,
})

const [command] = positionals

const subcommands = ['dev', 'build', 'preview']

if (!subcommands.includes(command)) {
  console.log('Commands: dev, build, preview')
  process.exit(1)
}

const proc = spawn(process.execPath, [astroBin, command], {
  stdio: 'inherit',
  cwd: packageDir,
  env: { ...process.env, CHATS_SHARE_WORKDIR: process.cwd() },
})

proc.on('exit', code => process.exit(code || 0))
