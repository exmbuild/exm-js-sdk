import { BundleBody } from "../common";

export interface BundleQueryResponse<After> {
    id: string;
    pseudoTimestamp: number;
    functionId: string;
    blockHeight: number;
    threeEmExecutorVersion: string;
    isExmFunctionExmDeployed: boolean;
    after?: After
}

export interface ReaderInterface<Paginator, AfterCursor> {
    fetchBundles: (paginator: Paginator) => Promise<BundleQueryResponse<AfterCursor>[]>
}