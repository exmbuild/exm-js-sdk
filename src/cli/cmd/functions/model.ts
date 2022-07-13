import {ContractType} from "../../../common/model";

export interface DeployOpts {
    wallet: string;
    src?: string;
    contractTx?: string;
    initState?: string;
    initStateSrc?: string;
    type?: "wasm" | "js" | "evm" | ContractType;
}