import {EmVars} from "../vars";
import {postRequest} from "../utils/commons";
import {WriteAction, WriteOpBody, WriteOpResult} from "../model";
import {WriteOpFailure} from "../exceptions/writeOpFailure";

const inputToString = (input: any) => {
    if(typeof input !== 'string') {
        input = JSON.stringify(input);
    }

    return input;
}

const cleanInput = (writeAction: WriteAction) => {
    if(!writeAction.input) {
        throw new Error(`Property 'input' is required in a write operation`);
    }
    if(!writeAction.tags) {
        writeAction.tags = [];
    }

    writeAction.input = inputToString(writeAction.input);

    return writeAction;
}

/**
 * This method allows you to execute write operations inside EM Trustless, Serverless Functions.
 * By requesting to the module `em-backend`, it creates a write operation which will be automatically processed.
 * Note that the result returned by this function is optimistic as the final processing for the global state of the function
 * Might take a few more seconds in order for it to be available and propagated.
 *
 *
 * @param functionId The function ID (An Arweave valid TX id) to be processed
 * @param writeOps A single operation or an array of operations to be sent. Note a limit of 499 write operations are enforced.
 * @param emToken EM Token to authenticate request
 * @param ignoreState Whether optimistic state should not be returned
 * @param raw Whether it's a write input or an input to be constructed.
 */
export const writeFunction = async <T = any> (functionId: string, writeOps: WriteAction[] | any, emToken: string, ignoreState: boolean | undefined, raw: boolean): Promise<WriteOpResult<T>> => {
    let body: Partial<WriteOpBody> = {
        functionId
    };

    let inputs: WriteAction[] = [];

    if(raw) {
        let writeOpsScope: WriteAction | WriteAction[] = writeOps;
        if(Array.isArray(writeOpsScope)) {
            writeOpsScope.forEach((i, index) => {
                writeOpsScope[index] = cleanInput(i);
            });
        } else {
            writeOpsScope = cleanInput(writeOpsScope);
        }

        inputs = Array.isArray(writeOpsScope) ? writeOpsScope : [writeOpsScope];
    } else {
        if(Array.isArray(writeOps)) {
            inputs = writeOps.map((i) => ({ input: inputToString(i), tags: [] }));
        } else {
            inputs = [{ input: inputToString(writeOps), tags: [] }]
        }
    }

    body.inputs = inputs;

    if(body.inputs.length > 499) {
        throw new WriteOpFailure("Only 499 writes are allowed in a single query.");
    }

    let reqUrl = `${EmVars.EM_BACKEND_URL}/transactions?token=${emToken}`;
    if(ignoreState) {
        reqUrl = `${reqUrl}&ignoreState=true`;
    }

    const data = await postRequest(reqUrl, body);
    let bodyJson: any = await data.json();

    if(data.ok) {
        return bodyJson as WriteOpResult<T>
    } else {
        if(bodyJson && bodyJson.statusCode && bodyJson.error && bodyJson.message) {
            throw new WriteOpFailure(`${bodyJson.statusCode}: Internal server error while sending write operation to function ${functionId}. "Error: ${bodyJson.message}"`, bodyJson.statusCode);
        } else {
            throw new WriteOpFailure(`${data.status}: Something went wrong, write operation for function ${functionId} could not be sent.`);
        }
    }
}