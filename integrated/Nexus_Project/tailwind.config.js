const { themeColors } = require("./theme.config");
const plugin = require("tailwindcss/plugin");

const tailwindColors = Object.fromEntries(
  Object.entries(themeColors).map(([name, swatch]) => [
    name,
    {
      DEFAULT: `var(--color-${name})`,
      light: swatch.light,
      dark: swatch.dark,
    },
  ]),
);

// Add custom Nexus colors
tailwindColors.nexus = {
  DEFAULT: 'var(--color-nexus)',
  light: '#0a7ea4',
  dark: '#0a7ea4',
};
tailwindColors.accent = {
  DEFAULT: 'var(--color-accent)',
  light: '#6366F1',
  dark: '#6366F1',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  // Scan all component and app files for Tailwind classes
  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}", "./lib/**/*.{js,ts,tsx}", "./hooks/**/*.{js,ts,tsx}"],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: tailwindColors,
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'monospace'],
      },
      animation: {
        heartbeat: 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("light", ':root:not([data-theme="dark"]) &');
      addVariant("dark", ':root[data-theme="dark"] &');
    }),
  ],
};
