import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/*.dto.ts"],
  format: ["cjs", "esm"],
  dts: true,
  outDir: "dist",
  minify: true,
  external: ["zod"],
  tsconfig: "tsconfig.json",
  outExtension: ({ format }) => ({
    js: format === "cjs" ? ".js" : ".mjs",
  }),
});
