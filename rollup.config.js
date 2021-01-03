import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import sveltePreprocess from 'svelte-preprocess';
import css from 'rollup-plugin-css-only';
import index from '@pathscale/rollup-plugin-tsickle';
import closureCompiler from "@ampproject/rollup-plugin-closure-compiler";
import typescript from "@rollup/plugin-typescript";

const production = !process.env.ROLLUP_WATCH;

function serve () {
    let server;

    function toExit () {
        if ( server ) server.kill( 0 );
    }

    return {
        writeBundle () {
            if ( server ) return;
            server = require( 'child_process' ).spawn( 'npm', [ 'run', 'start', '--', '--dev' ], {
                stdio: [ 'ignore', 'inherit', 'inherit' ],
                shell: true
            } );

            process.on( 'SIGTERM', toExit );
            process.on( 'exit', toExit );
        }
    };
}

export default {
    input: { main: 'src/main.ts' },
    output: {
        format: 'esm',
        name: 'canelhasio',

        dir: 'public/build',
        // file: 'public/build/bundle.js',
        sourcemap: !production,


    },
    plugins: [
        svelte( {
            preprocess: sveltePreprocess(),
            compilerOptions: {
                // hydratable : true,

                // enable run-time checks when not in production
                dev: !production,
                immutable: true,

            }
        } ),
        // we'll extract any component CSS out into
        // a separate file - better for performance
        css( { output: 'bundle.css' } ),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve( {
            browser: true,
            dedupe: [ 'svelte' ]
        } ),
        commonjs(),

        typescript( {
            sourceMap: !production,
            inlineSources: !production
        } ),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload( 'public' ),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        // production && terser()
        production && closureCompiler( {
            compilation_level: 'ADVANCED_OPTIMIZATIONS',
            language_in: 'ECMASCRIPT_2020',
            language_out: 'ECMASCRIPT_2015',
            module_resolution: 'node',
            jscomp_off: 'checkVars',
            rewrite_polyfills: false,
            warning_level: 'QUIET',
            process_common_js_modules: true,
        } ),

    ],
    watch: {
        clearScreen: false
    }
};
