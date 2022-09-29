import {ContractType} from "../../../common/model";

export interface DeployOpts {
    useArweave?: boolean;
    wallet?: string;
    src?: string;
    contractTx?: string;
    initState?: string;
    initStateSrc?: string;
    token?: string;
    type?: "wasm" | "js" | "evm" | ContractType;
}

export interface FunctionTestOpts {
    src?: string;
    input: Array<string>
    initState?: string
    initStateSrc?: string;
    type?: string;
}