import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import svgr from '@svgr/rollup';
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
    resolve: {
        alias: {
            src: resolve(__dirname, 'src'),
        },
    },
    plugins: [svgr(), react(), flowbiteReact()],
});

