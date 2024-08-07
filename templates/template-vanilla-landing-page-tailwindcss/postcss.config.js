"use strict";

import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";

export default{
    plugins: [
        postcssImport,
        tailwindcss,
        autoprefixer,
        postcssNested
    ]
};