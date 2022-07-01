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