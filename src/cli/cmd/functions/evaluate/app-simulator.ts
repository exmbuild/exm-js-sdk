import {simulateContract, SimulateExecutionContext} from "three-em-0-3-16";

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
    } else if(isVersion(context.version)('0.3.14')) {
        const simulateContract = require('three-em-0-3-14').simulateContract;
        return simulateContract(context);
    } else if(isVersion(context.version)('0.3.15')) {
        const simulateContract = require('three-em-0-3-15').simulateContract;
        return simulateContract(context);
    } else if(isVersion(context.version)('0.3.16')) {
        const simulateContract = require('three-em-0-3-16').simulateContract;
        return simulateContract(context);
    } else if(isVersion(context.version)('0.3.17')) {
        const simulateContract = require('three-em-0-3-16').simulateContract;
        return simulateContract(context);
    } else if(isVersion(context.version)('0.3.20')) {
        const simulateContract = require('three-em-0-3-16').simulateContract;
        return simulateContract(context);
    } else {
        const simulateContract = require('three-em-0-3-09').simulateContract;
        return simulateContract(context.contractId, context.interactions, context.contractInitState, context.maybeConfig, context.maybeCache, context.maybeBundledContract, context.maybeSettings, context.maybeExmContext);
    }
}

