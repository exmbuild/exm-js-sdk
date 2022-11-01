import { Command } from "commander";
import {functionReadCmd} from "./cmd/functions/read";
import {functionWriteCmd} from "./cmd/functions/write";
import {functionDeployCmd} from "./cmd/functions/deploy";
import {evaluateExmFunction} from "./cmd/functions/evaluate/evaluate";
import {functionTest} from "./cmd/functions/function-test";

const program = new Command();

program.name('exm')
       .description('A CLI to interact with the Execution Machine.')
       .version('0.1.5');

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
    .option('-s, --src <value>', 'Path to source code of function. Example: /Documents/function.wasm .')
    .option('--contract-tx <value>', 'ID of Source Function already deployed to Arweave.')
    .option('-i, --init-state <value>', 'Init State for Function to be deployed under init function.')
    .option('--init-state-src <value>', 'Path to init state file.')
    .option('-t, --type <value>', 'Type of function to be deployed.')
    .option('-t, --token <value>', 'Execution Machine API Token to be used.')
    .action(functionDeployCmd);

program.command('function:evaluate')
    .alias('fx:e')
    .description('Evaluates the state of an EXM application')
    .argument('<txId>', 'ID of deployed function')
    .action(evaluateExmFunction);

program.command('function:test')
    .alias('fx:t')
    .description('Test a function inside a simulated EXM environment')
    .option('-s, --src <value>', 'Path to source code of function. Example: /Documents/function.js')
    .option('--init-state <value>', 'JSON value containing the initial state of the function')
    .option('--init-state-src <value>', 'Path to init state file.')
    .option('-t, --type <value>', 'Type of function to be deployed.')
    .option('-i, --input <value>', `Inputs to be used during evaluation. Usage: --input '{\"someProperty\":\"value\"} --input '{}'`, (value: string, previous: string[]) => previous.concat([value]), [])
    // @ts-ignore
    .action(functionTest);

program.parse(process.argv);
