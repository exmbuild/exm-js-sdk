import {ReadResult} from "../model";
import {EmVars} from "../vars";
import {ReadFailure} from "../exceptions/readFailure";

/**
 * This method allows you to read the state of a function being used in EM (Execution Machine)
 * No token is needed since states are technically public from an evaluation perspective
 *
 * @param functionId The function ID (An Arweave valid TX id) to obtain the state for
 */
export const readFunction = async <T = any> (functionId: string): Promise<ReadResult<T>> => {
    const fetchState = await fetch(`${EmVars.EM_READ_URL}/${functionId}`);
    if(fetchState.ok) {
        return (await fetchState.json()) as ReadResult<T>;
    } else {
        throw new ReadFailure(`EM was not able to read state for function ${functionId}`);
    }
}