import {FunctionTestOpts} from "./model";
import {error} from "../../utils/common";
import {readFileSync} from "fs";
import {figureOutContractType} from "../../../common/utils/commons";
import {createWrite, TestFunction} from "../../../test/test-function";
import {ContractType} from "../../../common/model";
import {SimulateContractType} from "three-em-0-3-14";

export const functionTest = async (opts: FunctionTestOpts) => {
    if(!opts.src) {
        error("A function source path must be specified");
        return;
    }

    let initState = undefined;

    if(opts.initStateSrc) {
        initState = readFileSync(opts.initStateSrc, 'utf8')
    } else {
        if (!opts.initState) {
            error("Initial state must be specified and it must be a JSON-valid expression");
            return;
        }
        initState = opts.initState;
    }

    if(!opts.input || opts.input.length <= 0) {
        error("Single or multiple inputs must be specified");
        return;
    }

    const bufferSource = readFileSync(opts.src);
    const contractType = figureOutContractType(opts.type || opts.src, opts.type !== undefined);

    const writeOperations = opts.input.map((input) => createWrite(input, [], undefined, true));
    const testFunction = await TestFunction({
        contractType: contractType == ContractType.WASM ? SimulateContractType.WASM : SimulateContractType.JAVASCRIPT,
        contractInitState: JSON.parse(initState),
        contractSource: bufferSource,
        writes: writeOperations
    });

    console.log(JSON.stringify({
        state: testFunction.state,
        validity: testFunction.validity
    }, null, 2));
    return testFunction;
}