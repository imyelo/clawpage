import { z } from 'zod'

const AnalyticsSchema = z.object({
  google_analytics_id: z.string().optional(),
})

const TemplateOptionsPromoSchema = z.object({
  enabled: z.boolean().optional(),
})

const TemplateOptionsSchema = z.object({
  footer: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  analytics: AnalyticsSchema.optional(),
  promo: TemplateOptionsPromoSchema.optional(),
})

const TemplateSchema = z.object({
  options: TemplateOptionsSchema.optional(),
})

export const ChatsShareConfigSchema = z.object({
  site: z.string().url().optional(),
  base: z.string().optional(),
  public_dir: z.string().optional(),
  out_dir: z.string().optional(),
  chats_dir: z.string().optional(),
  template: TemplateSchema.optional(),
})

export type ChatsShareConfig = z.infer<typeof ChatsShareConfigSchema>
