const svelte = require('@sveltejs/vite-plugin-svelte');
const { defineConfig } = require('vite');

module.exports = defineConfig(({ command, mode }) => {
	const isProduction = mode === 'production';
	return {
	    root: "./src",
	    // base: "/",
	    // publicDir: "../public",
		plugins: [svelte()],
		build: {
			minify: isProduction,
            // outDir: "../../dist",

        }
	};
});
