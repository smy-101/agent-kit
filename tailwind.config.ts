import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        'accent-light': 'var(--accent-light)',
        border: 'var(--border)',
        'code-bg': 'var(--code-bg)',
        'user-bubble': 'var(--user-bubble)',
        'user-text': 'var(--user-text)',
        'ai-bubble': 'var(--ai-bubble)',
        'ai-text': 'var(--ai-text)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
