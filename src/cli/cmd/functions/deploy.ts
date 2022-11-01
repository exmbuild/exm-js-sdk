import {readFileSync} from "fs";
import {DeployOpts} from "./model";
import {ContractType, Tag} from "../../../common/model";
import {em} from "../em-wrapper";
import {error} from "../../utils/common";
import {figureOutContractType} from "../../../common/utils/commons";


const Confirm = require('prompt-confirm');
const chalk = require('chalk');

const boxMarks = {
    nw: '╭',
    n: '─',
    ne: '╮',
    e: '│',
    se: '╯',
    s: '─',
    sw: '╰',
    w: '│'
};

export const functionDeployCmd = async (opts: DeployOpts) => {
    let contentType: ContractType = figureOutContractType(opts.type || opts.src, opts.type !== undefined);
    let initState: string;

    if (opts.initState) {
        initState = opts.initState;
    } else if (opts.initStateSrc) {
        initState = readFileSync(opts.initStateSrc, 'utf8');
    } else {
        error(`Deployment requires --init-state or --init-state-src to be passed`);
    }

    let contractData: Uint8Array;

    if(!opts.token) {
        error('EXM Token (--token) is required to deploy functions through EXM');
    }

    if(opts.contractTx) {
        const fetchContractSourceTx = await fetch(`https://arweave.net/${opts.contractTx}`);
        if(fetchContractSourceTx.ok) {
            contractData = new Uint8Array(await fetchContractSourceTx.arrayBuffer());
        } else {
            console.error(`Source function transaction ${opts.contractTx} is invalid or does not exist.`);
        }
    } else if(opts.src) {
        contractData = await readFileSync(opts.src);
    } else {
        error(`Deployment requires --contract-tx or --src`);
    }

    const confirmation = await new Confirm(`Do you want to deploy this function?`).run();
    if(confirmation) {

        if(opts.token) {
            em.changeToken(opts.token);
        }

        const Box = require('cli-box');
        const beginDeployment = await em.functions.deploy(contractData, initState, contentType);

        const resultBox = new Box({
            w: 100,
            h: 4,
            stringify: false,
            marks: boxMarks,
            hAlign: 'left',
            vAlign: 'top'
        }, `Function deployed 🎉
▸ EXM Function ID :   ${beginDeployment.id}
▸ EXM Function Source :   https://arweave.net/${beginDeployment.id}
▸ Function URL :   https://${beginDeployment.id}.exm.run`);

        console.log(resultBox.stringify());

        const functionUrlExample = new Box({
            w: 100,
            h: 8,
            stringify: false,
            marks: boxMarks,
            hAlign: 'left',
            vAlign: 'top'
        }, `${chalk.blue('Id: ')} ${beginDeployment.id}
        
        curl --location --request POST 'https://${beginDeployment.id}.exm.run'
        --header 'Content-Type: application/json'
        --data-raw '{}' ${chalk.blue('<= Any JSON body')}
        
        Documentation: https://docs.exm.dev/trustless-serverless-functions/function-urls
        `);

        console.log(functionUrlExample.stringify());
    }
}