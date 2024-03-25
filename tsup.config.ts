import { defineConfig } from "tsup";

export default defineConfig({
    target: 'node14',
    format: ['esm', 'cjs'],
    entry: ['./index.ts'],
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
    clean: true,
    sourcemap: true,
    splitting: true,
});