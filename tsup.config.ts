import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/format-date-range.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
});
