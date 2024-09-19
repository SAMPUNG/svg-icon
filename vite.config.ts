import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    assetsDir: 'assets',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    emptyOutDir: false,
    lib: {
      entry: './index.ts',
      fileName: 'index',
      formats: ['es', 'cjs'],
      name: 'svgIcon',
    },
    manifest: false,
    minify: 'esbuild',
    outDir: './',
    reportCompressedSize: true,
    sourcemap: false,
    target: 'es2015',
    write: true,
  },
  esbuild: {
    drop: ['console', 'debugger']
  },
  publicDir: false,
})
