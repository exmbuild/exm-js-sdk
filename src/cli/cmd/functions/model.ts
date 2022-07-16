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