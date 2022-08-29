import {Tag} from "../../../../common/model";

export interface ExmContext {
    requests: Record<string, any>
}

export interface BundleTxEntity {
    raw: {
        id: string,
        owner: string,
        quantity: string,
        reward: string,
        tags: Tag[],
        input: any
    },
    metadata: {
        createdBy: string,
        createdWhen: number,
        executorVersion: string,
        internalId: number;
    }
}

export interface BundleBody {
    entities: BundleTxEntity[],
    exmContext: ExmContext
}

export interface CommonEvaluateOpts {
    exmFunctionId: string
    cache?: boolean
}

export const buildContext = (exmContext: ExmContext) => {
    if(exmContext) {
        if(!exmContext.requests) {
            exmContext.requests = {};
        }
        return exmContext;
    } else {
        return {
            requests: {}
        }
    }

}