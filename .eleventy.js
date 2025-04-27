//@ts-check

/** @typedef{import("./node_modules/@11ty/eleventy/src/UserConfig").default} EleventyConfig */

import tailwind from "@tailwindcss/postcss";
import postCss from "postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

import path from "node:path";
import { minify } from "html-minifier-terser";

import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

import dateFilter from 'nunjucks-date-filter';

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

    eleventyConfig.ignores.add("**/README.md");

    // Create a unique string that changes every build
    eleventyConfig.addShortcode("version", function () {
        return now;
    });

    eleventyConfig.addNunjucksFilter("date", dateFilter);

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
    eleventyConfig.addTransform(
        "htmlmin",
        (
            /** @type string */ content,
            /** @type string|boolean */ outputPath,
        ) => {
            if (typeof outputPath == "string") {
                switch (path.extname(outputPath)) {
                    case ".html":
                    case ".xml":
                        return minify(content, {
                            collapseWhitespace: true,
                        });
                    default:
                }
            }
            return content;
        },
    );
}
