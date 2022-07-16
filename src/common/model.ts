export enum ContractType {
    JS = "application/javascript", // 'application/javascript', 'application/typescript'
    EVM = "application/octet-stream", // 'application/vnd.exm.evm', 'application/vnd.exm.sol'
    WASM = "application/wasm", // 'application/vnd.exm.wasm+rust', 'application/vnd.exm.wasm+c', 'application/vnd.exm.wasm+cpp'
}

export interface EmOpts {
    token: string;
}

export interface Tag {
    name: string;
    value: string;
}

export interface WriteAction<T = any> {
    input: T,
    tags: Array<Tag>
}

export interface WriteOpBody<T = any> {
    functionId: string;
    inputs: Array<WriteAction<T>>
}

export interface WriteOpResult<T = any> {
    status: "SUCCESS",
    data: {
        pseudoId: string;
        execution: {
            state: T,
            validity: Record<string, boolean>
        }
    }
}

export interface ReadResult<T = any> {
    state: T;
}

export interface DeployOpBody {
    contractSrc: Array<number>;
    contentType: string;
    initState: string;
    contractOwner?: string;
}

export interface DeployOpResult {
    id: string;
}

export interface DeployOpts {
    ownerAddress?: string;
}