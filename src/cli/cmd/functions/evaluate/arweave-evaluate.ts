import {ArweaveReader, Paginator} from "./readers/arweave/arweave-reader";
import {buildContext, CommonEvaluateOpts} from "./common";
import {cacheBundle} from "./fetch-bundle";
import {runExmdApp} from "./app-simulator";

export const arweaveEvaluate = async (opts: CommonEvaluateOpts) => {
    const arweaveReader = new ArweaveReader();

    let fetchBundles = true;
    let cursor = undefined;
    let state = undefined;

    while (fetchBundles) {
        let paginator: Paginator = { exmFunctionId: opts.exmFunctionId };

        if(cursor) {
            paginator.after = cursor;
        }

        const bundles = await arweaveReader.fetchBundles(paginator);
        if(bundles.length > 0) {
            const lastBundle = bundles[bundles.length - 1];
            cursor = lastBundle.after;
        }

        for (const bundleElement of bundles) {
            let bundleData = await cacheBundle(bundleElement.id, opts.cache);
            state = (await runExmdApp(bundleElement.threeEmExecutorVersion)(
                opts.exmFunctionId,
                bundleData.entities.map((i) => i.raw),
                JSON.stringify(state),
                undefined,
                false,
                bundleElement.isExmFunctionExmDeployed,
                {
                    'LAZY_EVALUATION': true
                },
                buildContext(bundleData.exmContext)
            ));
        }

        if(bundles.length <= 0) {
            fetchBundles = false;
        }
    }

    return state;
}