import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'
import html from '@rollup/plugin-html'
import nodePolyfills from 'rollup-plugin-node-polyfills';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload'
import copy from "rollup-plugin-copy";

const IS_WATCHED = process.env.ROLLUP_WATCH

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/bundle.js',
        format: 'esm',
    },
    plugins: [
        resolve({browser: true, preferBuiltins: true}),
        commonjs(),
        typescript(),
        html({
            title: 'Game Developer Assignment',
            meta: [{ charset: 'utf-8' }, {name: 'viewport', content: 'width=device-width, initial-scale=1' }],
        }),
        nodePolyfills(),
        copy({
            targets: [
                { src: 'public', dest: 'dist' }
            ]
        }),
        IS_WATCHED && livereload(),
        IS_WATCHED && serve({open: true, contentBase: 'dist'}),
    ]
};