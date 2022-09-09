import { parse } from "dotenv";
import {Tag} from "../../../common/model";
import {em} from "../em-wrapper";
import {WriteOpFailure} from "../../../common/exceptions/writeOpFailure";

export const functionWriteCmd = async (txId: string, opts: any) => {
    const tagsObj = parse(opts.tags.join('\n'));
    const tagsArray: Tag[] = Object.keys(tagsObj).map((i) => ({
        name: i,
        value: tagsObj[i]
    }));

    let input: any;

    try {
        const parsedInput = JSON.parse(opts.input);
        input = JSON.stringify(parsedInput);
    } catch(e) {
        input = opts.input;
    }

    if(opts.token) {
        em.changeToken(opts.token);
    }

    await em.functions.writeRaw(txId, [
        {
            input,
            tags: tagsArray
        }
    ]).then(({ data: { pseudoId, execution: { state, validity } } }) => {
        if (validity[pseudoId]) {
            console.log(
                `Write query ${pseudoId} (pseudo-id) was successfully executed`,
            );
        } else {
            console.log(
                `Write query ${pseudoId} (pseudo-id) could not be executed`,
            );
        }
        if(opts.showOutput) {
            console.log(`\n${JSON.stringify({ state, validity}, null, 2)}`)
        }
    }).catch((e) => {
        if(e instanceof WriteOpFailure) {
            if(e.statusCode === 403) {
                console.log('403: Write operation could not be completed because the resource could not be accessed or token is invalid.');
            } else {
                console.error(e.message);
            }
        } else {
            console.error(e.message);
        }
        process.exit(1);
    });
}