import {EmOpts, WriteAction} from "./model";
import {writeFunction} from "./functions/write";
import {readFunction} from "./functions/read";

export class Em {

    constructor(private readonly opts: EmOpts) {
        if(global && !global.fetch) {
            require('isomorphic-fetch');
        }
    }

    get functions() {
        return {
            write: async <T = any>(functionId: string, writeOps: Array<WriteAction> | WriteAction) => writeFunction<T>(functionId, writeOps, this.opts.token),
            read: async <T = any>(functionId: string) => readFunction<T>(functionId)
        }
    }

}
