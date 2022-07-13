import { Command } from "commander";
import {functionReadCmd} from "./cmd/functions/read";
import {functionWriteCmd} from "./cmd/functions/write";

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
    .action(functionWriteCmd);

program.parse(process.argv);
