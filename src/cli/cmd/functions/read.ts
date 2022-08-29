import {em} from "../em-wrapper";

export const functionReadCmd = async (txId: string) => {
    await em.functions.read(txId).then((r) => {
        console.log(JSON.stringify(r, null, 2));
    });
}