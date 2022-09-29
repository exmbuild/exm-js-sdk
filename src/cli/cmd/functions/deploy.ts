import {readFileSync} from "fs";
import {DeployOpts} from "./model";
import {TextDecoder, TextEncoder} from "util";
import {ContractType, Tag} from "../../../common/model";
import {em} from "../em-wrapper";
import {error} from "../../utils/common";
import {figureOutContractType} from "../../../common/utils/commons";

const Arweave = require('arweave');
const Confirm = require('prompt-confirm');

const Encoder = new TextEncoder();
const Decoder = new TextDecoder();

const initContract = async (initState: string, contractTxId: string, wallet: any, arweave: typeof Arweave) => {
    const tx = await arweave.createTransaction({
        data: Encoder.encode(initState),
    });

    tx.addTag("Contract-Src", contractTxId);
    await arweave.transactions.sign(tx, wallet);

    return [tx, {
        id: tx.id,
        tags: tx.tags.map(({ name, value }: Tag) => ({
            name: atob(name),
            value: atob(value),
        })),
        data: Decoder.decode(tx.data),
    }];
}

const successfulDeployment = (sourceTxId: string, initTxId: string) => {
    console.log("Function deployed 🎉\n");
    console.log(`EXM Function ID: ${initTxId}`);
    console.log("EXM Function Source Code:", "https://arweave.net/tx/" + sourceTxId);
    console.log("EXM Function:", "https://arweave.net/tx/" + initTxId);
    console.log(`\nUse Function Id ${initTxId} as your interaction reference.`);
}

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

    if(opts.useArweave === true) {
        const arweave = Arweave.init({
            host: "arweave.net",
            port: 443,
            protocol: "https",
        });

        if (!opts.wallet) {
            error('--wallet (Wallet Path) is required for deployments');
        }

        const wallet = JSON.parse(readFileSync(opts.wallet, 'utf8'));
        const address: string = await arweave.wallets.jwkToAddress(wallet);
        console.log("Deploying function using wallet", address);

        if (opts.contractTx) {
            console.log("Deploying contract using source transaction", opts.contractTx);

            const initDeploymentTx = await initContract(initState, opts.contractTx, wallet, arweave);
            console.log("\nInit Function:", initDeploymentTx[1]);

            const doDeploy = await new Confirm('Do you want to deploy this function?').run();

            if (doDeploy) {
                const res = await arweave.transactions.post(initDeploymentTx[0]);
                if (res.status >= 400) {
                    error(`Failed to deploy init Function. Source Function ID: ${opts.contractTx}`);
                }

                successfulDeployment(opts.contractTx, initDeploymentTx[1].id);
            } else {
                console.log("\nDeployment cancelled");
            }
        } else if (opts.src) {
            // Source Contract
            const txSource = await arweave.createTransaction({
                data: readFileSync(opts.src),
            });
            txSource.addTag("Content-Type", contentType);
            txSource.addTag("App-Name", "EM");
            txSource.addTag("Type", "Serverless-Function");
            await arweave.transactions.sign(txSource, wallet);

            // Init Contract
            const txInit = await initContract(initState, txSource.id, wallet, arweave);

            console.log(`\nSource Contract:`, {
                id: txSource.id,
                tags: txSource.tags.map(({name, value}: { [x: string]: string }) => ({
                    name: atob(name),
                    value: atob(value),
                }))
            });

            console.log(`\nInit Contract`, txInit[1]);

            const confirmation = await new Confirm('Do you want to deploy this function?').run();

            if (confirmation) {
                const txSourceDeployment = await arweave.transactions.post(txSource);
                if (txSourceDeployment.status >= 400) {
                    error(`Failed to deploy source contract.`);
                } else {
                    const initContractDeployment = await arweave.transactions.post(txInit[0]);
                    if (initContractDeployment.status >= 400) {
                        error(`Failed to init function. Source function ID: ${txSource.id}`);
                    }
                }

                successfulDeployment(txSource.id, txInit[1].id);
            } else {
                console.log("\nDeployment cancelled");
            }
        } else {
            error(`Deployment requires --contract-tx or --src`);
        }
    } else {
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

            const beginDeployment = await em.functions.deploy(contractData, initState, contentType);
            console.log(`Function deployed 🎉\n`);
            console.log(`EXM Function ID: ${beginDeployment.id}`);
            console.log(`EXM Function: https://arweave.net/${beginDeployment.id}`);
        }
    }
}