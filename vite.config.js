import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
	root: "./src",
	    // base: "/",
	publicDir: "./public",

	plugins: [svelte({ configFile: "../svelte.config.js"})]
})

