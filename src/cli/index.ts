import { Command } from "commander";
import {functionReadCmd} from "./cmd/functions/read";
import {functionWriteCmd} from "./cmd/functions/write";
import {functionDeployCmd} from "./cmd/functions/deploy";

const program = new Command();

program.name('exm')
       .description('A CLI to interact with the Execution Machine.')
       .version('0.1.0');

program.command('function:read')
.alias('fx:r')
.description('Read the state of a function in EXM.')
.argument('<txId>', 'Arweave ID of function.')
.action(functionReadCmd);

program.command('function:write')
    .alias('fx:w')
    .description('Read the state of a function in EXM.')
    .argument('<txId>', 'Arweave ID of function.')
    .requiredOption('-i, --input <value>', 'Input to be passed to the function')
    .option('-t, --tags <value>', 'Tags to be used during write operation evaluation. Usage: --tags tag1=value1 --tags tag2="value 2"', (value: string, previous: string[]) => previous.concat([value]), [])
    .option('-t, --token <value>', 'Execution Machine API Token to be used.')
    .option('--show-output', 'Show optimistic execution output from write operation')
    .action(functionWriteCmd);

program.command('function:deploy')
    .alias('fx:d')
    .description('Deploy a EXM compatible function to Arweave.')
    .option('-w, --wallet <value>', 'Path to wallet to be used during deployment.')
    .option('-s, --src <value>', 'Path to source contract of function. Example: /Documents/contract.wasm .')
    .option('--contract-tx <value>', 'ID of Source Contract already deployed to Arweave.')
    .option('-i, --init-state <value>', 'Init State for contract to be deployed under init contract.')
    .option('--init-state-src <value>', 'Path to init state file.')
    .option('-t, --type <value>', 'Type of smart contract to be deployed.')
    .option('-t, --token <value>', 'Execution Machine API Token to be used.')
    .option('--use-arweave', 'Deploy function through Arweave and not EXM')
    .action(functionDeployCmd);

program.parse(process.argv);
