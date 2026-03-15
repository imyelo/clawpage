import { loadConfig } from 'c12'
import { type ClawpageConfig, ClawpageConfigSchema } from './config-schema'

let _configCache: ClawpageConfig | null = null

export async function getProjectConfig(): Promise<ClawpageConfig> {
  if (_configCache) {
    return _configCache
  }

  const { config } = await loadConfig<ClawpageConfig>({
    name: 'clawpage',
    configFile: 'clawpage',
    cwd: getWorkingDir(),
  })

  const parsed = ClawpageConfigSchema.safeParse(config)
  if (!parsed.success) {
    console.warn('Invalid config:', parsed.error.flatten())
    _configCache = {}
    return _configCache
  }

  _configCache = parsed.data || {}
  return _configCache
}

export function getWorkingDir() {
  return process.env.CHATS_SHARE_WORKDIR || process.cwd()
}
