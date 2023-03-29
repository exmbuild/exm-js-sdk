import {ExecuteConfig, simulateContract, SimulateContractType as ContractType, SimulateInput, Tag} from "three-em-0-3-22";
import {guidGenerator} from "../common/utils/commons";

// @ts-ignore
export const FunctionType = Object.assign({}, ContractType);
export type FunctionType = ContractType;

export type WriteInput = SimulateInput;
export type ExecutionConfig = ExecuteConfig;

export interface TestFunctionOpts {
    functionSource: Uint8Array,
    functionType: ContractType,
    functionInitState: any;
    writes: WriteInput[];
    gatewayConfig?: ExecutionConfig
    settings?: Record<string, any> | undefined | null,
    exmContext?: any | undefined | null
}

export const createWrite = (input: any, tags?: Array<Tag>, opts?: Partial<Omit<SimulateInput, "tags"|"input">>, inputIsJson?: boolean): SimulateInput => {
    return {
        id: opts?.id || guidGenerator(),
        owner: opts?.owner || "@test",
        quantity: opts?.quantity || "0",
        reward: opts?.reward || "0",
        target: opts?.target,
        tags: tags || [],
        block: opts?.block,
        input: inputIsJson ? input : JSON.stringify(input)
    };
}

export const TestFunction = async (opts: TestFunctionOpts) => {
    return await simulateContract({
        contractId: "",
        maybeContractSource: {
            // @ts-ignore
            contractSrc: opts.functionSource,
            contractType: opts.functionType
        },
        contractInitState: JSON.stringify(opts.functionInitState),
        maybeConfig: opts.gatewayConfig,
        maybeSettings: {
            ...(opts.settings || {}),
            'TX_DATE': `${new Date().getTime()}`
        },
        maybeExmContext: opts.exmContext,
        interactions: opts.writes,
        maybeCache: false
    });
}