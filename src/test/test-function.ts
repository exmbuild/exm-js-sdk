import {ExecuteConfig, simulateContract, SimulateContractType, SimulateInput, Tag} from "three-em-0-3-14";
import {guidGenerator} from "../common/utils/commons";

export interface TestFunctionOpts {
    contractSource: Uint8Array,
    contractType: SimulateContractType,
    contractInitState: any;
    writes: SimulateInput[];
    gatewayConfig?: ExecuteConfig
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
            contractSrc: opts.contractSource,
            contractType: opts.contractType
        },
        contractInitState: JSON.stringify(opts.contractInitState),
        maybeConfig: opts.gatewayConfig,
        maybeSettings: opts.settings,
        maybeExmContext: opts.exmContext,
        interactions: opts.writes,
        maybeCache: false
    });
}