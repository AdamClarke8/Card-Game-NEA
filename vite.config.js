import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: 'client',
    optimizeDeps: {
        include: ['phaser']
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: path.resolve(__dirname, 'client/index.html')
        },
    }
});
