// vite.config.js
import { defineConfig } from 'vite';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    root: './src',
    build: {
        manifest: false,
        outDir: '../dist',
    },
    css: {
        postcss: {
            config: './postcss.config.js'
        }
    },
    publicDir: '../static',
    resolve: {
        alias: {
            '@stores': resolve(__dirname, 'src', 'stores'),
            '@components': resolve(__dirname, 'src', 'components'),
            '@styles': resolve(__dirname, 'src', 'styles'),
        },
    },
    server: {
        cors: false,
        open: false
    },
    plugins: []
});