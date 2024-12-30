import type { Config } from "tailwindcss";

import daisyui from "daisyui";

const config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],  
  prefix: "",
  theme: {
    extend: {},
  },
  plugins: [daisyui],
} satisfies Config;

export default config;
