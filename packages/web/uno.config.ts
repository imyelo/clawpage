import presetTypography from '@unocss/preset-typography'
import transformerDirectives from '@unocss/transformer-directives'
import { defineConfig, presetUno } from 'unocss'
import type { Theme } from 'unocss/preset-uno'

export default defineConfig<Theme>({
  theme: {
    colors: {
      // Design tokens for retro geek theme
      bg: {
        primary: '#0a0a0a',
        secondary: '#141414',
        tertiary: '#1a1a1a',
      },
      text: {
        primary: '#e8e6e3',
        secondary: '#8a8785',
        muted: '#5c5958',
      },
      accent: {
        DEFAULT: '#d4a853',
        dim: '#8b7038',
      },
      border: '#2a2a2a',
      msg: {
        user: { bg: '#121212', border: '#1a1a1a' },
        assistant: { bg: '#161616', border: '#2d2d2d' },
      },
      // Collapsible message type colors (dark theme optimized)
      collapsible: {
        error: {
          border: '#ef4444',
          accent: '#f87171',
          'hover-bg': 'rgba(239, 68, 68, 0.1)',
          'icon-bg': 'rgba(239, 68, 68, 0.15)',
        },
        session: {
          border: '#10b981',
          accent: '#34d399',
          'hover-bg': 'rgba(16, 185, 129, 0.1)',
          'icon-bg': 'rgba(16, 185, 129, 0.15)',
        },
        custom: {
          border: '#6366f1',
          accent: '#818cf8',
          'hover-bg': 'rgba(99, 102, 241, 0.1)',
          'icon-bg': 'rgba(99, 102, 241, 0.15)',
        },
        muted: {
          border: '#6b7280',
          accent: '#9ca3af',
          'hover-bg': 'rgba(107, 114, 128, 0.1)',
          'icon-bg': 'rgba(107, 114, 128, 0.15)',
        },
      },
      // Semantic UI tokens for message types
      ui: {
        error: {
          DEFAULT: '#e85453',
          light: '#f87171',
          dim: '#fca5a5',
          bg: '#fef2f2',
          'bg-opacity': 'rgba(254, 242, 242, 0.4)',
        },
        success: {
          DEFAULT: '#22c55e',
          light: '#4ade80',
          dim: '#86efac',
          bg: '#f0fdf4',
          'bg-opacity': 'rgba(240, 253, 244, 0.2)',
        },
        info: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dim: '#a5b4fc',
          bg: '#eef2ff',
          'bg-opacity': 'rgba(238, 242, 255, 0.2)',
        },
        muted: {
          DEFAULT: '#6b7280',
          light: '#9ca3af',
          dim: '#d1d5db',
          bg: '#f9fafb',
          'bg-opacity': '',
        },
      },
    },
    fontFamily: {
      mono: '"IBM Plex Mono", monospace',
      serif: '"Libre Baskerville", Georgia, serif',
    },
  },
  content: {
    filesystem: ['src/**/*.{astro,tsx,jsx,ts,js}'],
  },
  presets: [
    presetUno(),
    presetTypography({
      cssExtend: {
        // Dark theme typography
        'h1,h2,h3,h4,h5,h6': {
          'margin-top': '1em',
          'margin-bottom': '0.5em',
          'font-weight': '600',
          color: '#e8e6e3',
        },
        h1: { 'font-size': '1.5em' },
        h2: { 'font-size': '1.25em' },
        h3: { 'font-size': '1.1em' },
        p: {
          'margin-top': '0.75em',
          'margin-bottom': '0.75em',
          color: '#a8a7a5',
        },
        'ul,ol': {
          'margin-top': '0.5em',
          'margin-bottom': '0.5em',
          color: '#a8a7a5',
        },
        li: {
          'margin-top': '0.25em',
          'margin-bottom': '0.25em',
          color: '#a8a7a5',
        },
        // Fix bold text visibility - strong contrast
        'strong, b': {
          color: '#ffffff',
          'font-weight': '700',
        },
        // Links
        a: {
          color: '#d4a853',
          'text-decoration': 'none',
          'text-underline-offset': '2px',
          transition: 'all 0.2s',
        },
        'a:hover': {
          color: '#e8c678',
          'text-decoration': 'underline',
        },
        // Code blocks
        code: {
          color: '#d4a853',
          background: '#1a1a1a',
          padding: '0.125em 0.375em',
          'border-radius': '2px',
          'font-size': '0.875em',
        },
        'pre code': {
          background: 'transparent',
          padding: '0',
        },
        pre: {
          background: '#141414',
          border: '1px solid #2a2a2a',
          'border-radius': '4px',
        },
        // Blockquote
        blockquote: {
          'margin-top': '1em',
          'margin-bottom': '1em',
          'padding-left': '1em',
          'border-left': '3px solid #d4a853',
          color: '#8a8785',
          'font-style': 'normal',
          background: '#141414',
          padding: '0.75em 1em',
          'border-radius': '0 4px 4px 0',
        },
        'blockquote p:first-of-type': {
          'margin-top': '0',
        },
        'blockquote p:last-of-type': {
          'margin-bottom': '0',
        },
        // Horizontal rule
        hr: {
          'border-color': '#2a2a2a',
        },
        // Tables
        'table th, table td': {
          'border-color': '#2a2a2a',
        },
        'table th': {
          color: '#e8e6e3',
        },
        'table td': {
          color: '#c5c4c2',
        },
      },
    }),
  ],
  transformers: [transformerDirectives()],

  safelist: [
    // Avatar colors
    'bg-blue-500',
    'bg-purple-500',
    'bg-slate-700',
    'bg-emerald-500',
    'bg-rose-500',
    'bg-indigo-500',
    // Message colors
    'bg-msg-user-bg',
    'border-msg-user-border',
    'bg-msg-assistant-bg',
    'border-msg-assistant-border',
    // accent border
    'border-l-accent',
    'border-l-accent-light',
    'border-l-accent-dim',
    'border-l-accent-error',
    // UI tokens for message types
    'text-ui-error',
    'text-ui-success',
    'text-ui-info',
    'text-ui-muted',
    'border-l-ui-error',
    'border-l-ui-success',
    'border-l-ui-info',
    'border-l-ui-muted',
    'bg-ui-error-bg-opacity',
    'bg-ui-success-bg-opacity',
    'bg-ui-info-bg-opacity',
  ],
})
