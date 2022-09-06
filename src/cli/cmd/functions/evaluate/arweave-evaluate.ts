import {ArweaveReader, Paginator} from "./readers/arweave/arweave-reader";
import {buildContext, CommonEvaluateOpts} from "./common";
import {cacheBundle} from "./fetch-bundle";
import {runExmFunction} from "./app-simulator";

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
            const run = await runExmFunction({
                version: bundleElement.threeEmExecutorVersion,
                contractId: opts.exmFunctionId,
                interactions: bundleData.entities.map((i) => i.raw),
                contractInitState: JSON.stringify(state?.state),
                maybeConfig: undefined,
                maybeCache: false,
                maybeBundledContract: bundleElement.isExmFunctionExmDeployed,
                maybeSettings: {
                    'LAZY_EVALUATION': true
                },
                maybeExmContext: buildContext(bundleData.exmContext)
            });
            state = run;
        }

        if(bundles.length <= 0) {
            fetchBundles = false;
        }
    }

    return state;
}