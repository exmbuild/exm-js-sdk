import {EmVars} from "../vars";
import {postRequest} from "../utils/commons";
import {WriteAction, WriteOpBody, WriteOpResult} from "../model";
import {WriteOpFailure} from "../exceptions/writeOpFailure";

/**
 * This functions allows you to execute write operations inside EM Trustless, Serverless Functions.
 * By requesting to the module `em-backend`, it creates a write operation which will be automatically processed.
 * Note that the result returned by this function is optimistic as the final processing for the global state of the function
 * Might take a few more seconds in order for it to be available and propagated.
 *
 *
 * @param functionId The function ID (An Arweave valid TX id) to be processed
 * @param writeOps A single operation or an array of operations to be sent. Note a limit of 499 write operations are enforced.
 * @param emToken EM Token to authenticate request
 */
export const writeFunction = async <T = any> (functionId: string, writeOps: Array<WriteAction> | WriteAction, emToken: string): Promise<WriteOpResult<T>> => {
    let body: Partial<WriteOpBody> = {
        functionId
    };

    body.inputs = Array.isArray(writeOps) ? writeOps : [writeOps];

    if(body.inputs.length > 499) {
        throw new WriteOpFailure("Only 499 writes are allowed in a single query.");
    }

    const data = await postRequest(`${EmVars.EM_BACKEND_URL}/transactions?token=${emToken}`, body);
    let bodyJson = await data.json();

    if(data.ok) {
        return bodyJson as WriteOpResult<T>
    } else {
        if(bodyJson && bodyJson.statusCode && bodyJson.error && bodyJson.message) {
            throw new WriteOpFailure(`500: Internal server error while sending write operation to function ${functionId}. "Error: ${bodyJson.message}"`);
        } else {
            throw new WriteOpFailure(`${data.status}: Something went wrong, write operation for function ${functionId} could not be sent.`);
        }
    }
}