import findCacheDir from "find-cache-dir";
import { writeFile } from 'fs';
import path from 'path';
import {BundleBody} from "./common";

let __cacheDir = undefined;

export const cacheBundle = async (bundleId: string, cache?: boolean): Promise<BundleBody> => {
    if(cache) {
        __cacheDir = findCacheDir({
            name: 'exm',
            create: true
        });
    }

    const fetchBundle = await fetch(`https://arweave.net/${bundleId}`);
    if(fetchBundle.ok) {
        const bundleData = await fetchBundle.json();
        if (cache) {
            if(__cacheDir) {
                writeFile(path.join(__cacheDir, `${bundleId}.json`), JSON.stringify(bundleData), () => {
                });
            } else {
                console.log(`Cache Dir not found. Skipping ⏭️\n`);
            }
        }
        return bundleData;
    }

    throw new Error(`Bundle ${bundleId} could not be fetched`);
}