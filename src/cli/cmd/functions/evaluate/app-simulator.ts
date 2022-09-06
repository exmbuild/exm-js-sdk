import {SimulateExecutionContext} from "three-em-0-3-13";

export interface ExmRunContext extends SimulateExecutionContext {
    version: string;
    [k: string]: any
}

export const runExmFunction = (context: ExmRunContext) => {
    const isVersion = (executionVersion: string) => (executorVersion: string) => {
        return (executionVersion.includes(`^${executorVersion}`) || executionVersion.includes(executorVersion))
    }

    if(isVersion(context.version)('0.3.12')) {
        const simulateContract = require('three-em-0-3-12').simulateContract;
        return simulateContract(context.contractId, context.interactions, context.contractInitState, context.maybeConfig, context.maybeCache, context.maybeBundledContract, context.maybeSettings, context.maybeExmContext);
    } else if(isVersion(context.version)('0.3.13')) {
        const simulateContract = require('three-em-0-3-13').simulateContract;
        return simulateContract(context);
    } else {
        const simulateContract = require('three-em-0-3-09').simulateContract;
        return simulateContract(context.contractId, context.interactions, context.contractInitState, context.maybeConfig, context.maybeCache, context.maybeBundledContract, context.maybeSettings, context.maybeExmContext);
    }
}

