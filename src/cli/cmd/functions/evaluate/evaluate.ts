import {arweaveEvaluate} from "./arweave-evaluate";

export const evaluateExmFunction = async (txId: string) => {
    const readState = JSON.stringify((await arweaveEvaluate({
        exmFunctionId: txId,
        cache: true,
    })).state, null, 2);
    console.log(readState);
}