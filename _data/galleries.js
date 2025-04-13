//@ts-check

import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const GalleryDirectory = "gallery";

export default async function () {
    // Find all subdirectories in the gallery directory
    const galleries = (await readdir(GalleryDirectory, { withFileTypes: true }))
        .filter((dirent) => dirent.isDirectory())
        .map((d) => d.name);

    return Promise.all(
        galleries.map(async (galleryName) => {
            // Find and parse the info.json file, if it exists
            const galleryPath = path.join(GalleryDirectory, galleryName);

            const infoPath = path.join(galleryPath, "info.json");

            let info = {};

            if (existsSync(infoPath)) {
                try {
                    info = JSON.parse((await readFile(infoPath)).toString());
                } catch {
                    info = {};
                }
            }

            // Find all images in the gallery

            const galleryEntries = (await readdir(galleryPath))
                .filter(
                    (p) =>
                        p.endsWith(".jpg") ||
                        p.endsWith(".png") ||
                        p.endsWith(".jpeg"),
                )
                .map((fileName) => path.join("../" + galleryPath, fileName));

            // Return the gallery object
            return {
                ...info,
                id: galleryName,
                images: galleryEntries,
            };
        }),
    );
}
