'use strict';

const terser = require('@rollup/plugin-terser');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const outputDefault = {
    format: 'cjs',
    strict: true,
    generatedCode: {
        preset: 'es5',
        arrowFunctions: true,
        constBindings: true,
        objectShorthand: true,
        symbols: true,
    },
    extend: true,
    validate: true,
    compact: true
};

module.exports = {
    input: 'src/main.js',
    plugins: [nodeResolve(), commonjs()],
    output: [
        {
            file: 'lib/main.min.js',
            plugins: [
                terser({
                    module: true,
                    ecma: 5,
                    keep_classnames: true,
                    keep_fnames: true,
                })
            ],
            ...outputDefault
        }
    ]
};