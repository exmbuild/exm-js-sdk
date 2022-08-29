import {ContractType, DeployOpBody, DeployOpResult, DeployOpts} from "../model";
import {postRequest} from "../utils/commons";
import {EmVars} from "../vars";
import {DeployOpFailure} from "../exceptions/deployOpFailure";

/**
 * This method allows you to deploy a function application through EXM.
 * No AR or Wallets are needed to execute the deployment.
 *
 * @param contractSrc Bytes (UInt8Array) of source code of function to be deployed
 * @param contractInitState String representing the initial state of the contract.
 * @param contractType JS, EVM, WASM.
 * @param emToken EM Token to authenticate request
 * @param opts Options for deployment
 */
export const deployFunction = async(contractSrc: Uint8Array, contractInitState: any, contractType: ContractType, emToken: string, opts?: DeployOpts) => {
    try {
        const bytes = Array.from(contractSrc.values());
        const body: Partial<DeployOpBody> = {
            contractSrc: bytes
        };
        body.contentType = contractType || ContractType.JS;
        let initState = '{}';

        if(contractInitState) {
            if(typeof contractInitState === 'object') {
                initState = JSON.stringify(contractInitState);
            } else {
                initState = String(contractInitState);
            }
        }

        body.initState = initState;
        body.contractOwner = (opts || {}).ownerAddress || "";

        const data = await postRequest(`${EmVars.EM_BACKEND_URL}/contract/deploy?token=${emToken}`, body);

        if (data.ok) {
            const json = await data.json();
            return json as DeployOpResult;
        } else {
            throw new DeployOpFailure(`${data.status}: Function application could not be deployed.`, data.status);
        }
    } catch(e) {
        if(e instanceof DeployOpFailure) {
            throw e;
        } else {
            throw new DeployOpFailure(`${e.toString()}`);
        }
    }
}