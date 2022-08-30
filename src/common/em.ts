import {ContractType, DeployOpts, EmOpts, WriteAction} from "./model";
import {writeFunction} from "./functions/write";
import {readFunction} from "./functions/read";
import {deployFunction} from "./functions/deploy";

export class Exm {

    constructor(private readonly opts: EmOpts) {
        if(global && !global.fetch) {
            require('isomorphic-fetch');
        }
    }

    /**
     * Changes the token passed in constructor
     * @param token
     */
    changeToken(token: string) {
        this.opts.token = token;
    }

    /**
     * Gets the methods related to EXM Functions product
     */
    get functions() {
        return {
            writeRaw: async <T = any>(functionId: string, writeOps: Array<WriteAction> | WriteAction) => writeFunction<T>(functionId, writeOps, this.opts.token, true),
            write: async <T = any>(functionId: string, inputs: any | Array<any>) => writeFunction<T>(functionId, inputs, this.opts.token, false),
            read: async <T = any>(functionId: string) => readFunction<T>(functionId),
            deploy: async(contractSrc: Uint8Array, contractInitState: any, contractType: ContractType, opts?: DeployOpts) => deployFunction(contractSrc, contractInitState, contractType, this.opts.token, opts)
        }
    }

}
