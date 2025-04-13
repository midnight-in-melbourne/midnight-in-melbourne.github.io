//@ts-check

/** @typedef{import("./node_modules/@11ty/eleventy/src/UserConfig").default} EleventyConfig */

import tailwind from "@tailwindcss/postcss";
import postCss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

import path from "node:path"
import { minify } from "html-minifier"

import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const postcssFilter = (cssCode, done) => {
    // we call PostCSS here.
    postCss([tailwind(), autoprefixer(), cssnano({ preset: "default" })])
        .process(cssCode, {
            // path to our CSS file
            from: "./_includes/styles/tailwind.css",
        })
        .then(
            (r) => done(null, r.css),
            (e) => done(e, null),
        );
};

const now = new Date().toISOString();

export default function (/** @type{EleventyConfig}  */ eleventyConfig) {
    eleventyConfig.setInputDirectory("content");
    eleventyConfig.setIncludesDirectory("../_includes");
    eleventyConfig.setDataDirectory("../_data");

    // Rebuild whenever our base CSS file changes
    eleventyConfig.addWatchTarget("./_includes/styles/tailwind.css");

    // Rebuild whenever our additional content folders change
    eleventyConfig.addWatchTarget("./gallery/");
    eleventyConfig.addWatchTarget("./downloads/");

    // Invoke PostCSS on build
    eleventyConfig.addNunjucksAsyncFilter("postcss", postcssFilter);

    // Add specific folders and files
    eleventyConfig.addPassthroughCopy("downloads");
    eleventyConfig.addPassthroughCopy("img");
    eleventyConfig.addPassthroughCopy({ "./_includes/fonts": "fonts" });
    eleventyConfig.addPassthroughCopy({
        "./node_modules/flowbite/dist/flowbite.min.js": "js/flowbite.min.js",
    });

    // Create a unique string that changes every build
    eleventyConfig.addShortcode("version", function () {
        return now;
    });

    // Run 11ty Image to process images
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
        htmlOptions: {
            imgAttributes: {
                alt: "", // required
                loading: "lazy",
                decoding: "async",
            },
        },
    });

    // Minify all output HTML
    eleventyConfig.addTransform("htmlmin", (/** @type string */ content, /** @type string */ outputPath) => {
        if (path.extname(outputPath) == ".html") {
            return minify(content, {
                collapseWhitespace: true,
            })
        } else {
            return content;
        }
    });
}
