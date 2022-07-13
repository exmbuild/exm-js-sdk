import {readFileSync} from "fs";
import {DeployOpts} from "./model";
import {TextDecoder, TextEncoder} from "util";
import {ContractType, Tag} from "../../../common/model";

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

const error = (message: string) => {
    console.error(message);
    process.exit(1);
}

const successfulDeployment = (sourceTxId: string, initTxId: string) => {
    console.log("Contract deployed 🎉\n");
    console.log("Contract Source:", "https://arweave.net/tx/" + sourceTxId);
    console.log("Smart Contract:", "https://arweave.net/tx/" + initTxId);
    console.log(`\nUse Smart Contract Id ${initTxId} as your interaction reference.`);
}

export const functionDeployCmd = async (opts: DeployOpts) => {
    const arweave = Arweave.init({
        host: "arweave.net",
        port: 443,
        protocol: "https",
    });

    if(!opts.wallet) {
        error('--wallet (Wallet Path) is required for deployments');
    }

    const wallet = JSON.parse(readFileSync(opts.wallet, 'utf8'));
    const address: string = await arweave.wallets.jwkToAddress(wallet);
    console.log("Deploying function using wallet", address);

    let initState: string;

    if(opts.initState) {
        initState = opts.initState;
    } else if(opts.initStateSrc) {
        initState = readFileSync(opts.initStateSrc, 'utf8');
    } else {
        error(`Deployment requires --init-state or --init-state-src to be passed`);
    }

    if(opts.contractTx) {
        console.log("Deploying contract using source transaction", opts.contractTx);

        const initDeploymentTx = await initContract(initState, opts.contractTx, wallet, arweave);
        console.log("\nInit Contract:", initDeploymentTx[1]);

        const doDeploy = await new Confirm('Do you want to deploy this function?').run();

        if(doDeploy) {
            const res = await arweave.transactions.post(initDeploymentTx[0]);
            if (res.status >= 400) {
                error(`Failed to deploy init contract. Source Contract ID: ${opts.contractTx}`);
            }

            successfulDeployment(opts.contractTx, initDeploymentTx[1].id);
        } else {
            console.log("\nDeployment cancelled");
        }
    } else if(opts.src) {

        let contentType: ContractType;
        if(opts.type) {
            switch (opts.type.toLowerCase()) {
                case "wasm":
                    contentType = ContractType.WASM;
                    break;
                case "evm":
                    contentType = ContractType.EVM;
                    break;
                case "js":
                    contentType = ContractType.JS;
                    break;
            }
        } else {
            const srcPathLowerCase = opts.src.toLowerCase();
            if (srcPathLowerCase.endsWith(".js")) {
                contentType = ContractType.JS;
            } else if (srcPathLowerCase.endsWith(".wasm")) {
                contentType = ContractType.WASM;
            } else {
                contentType = ContractType.JS;
            }
        }

       // Source Contract
        const txSource = await arweave.createTransaction({
            data: readFileSync(opts.src),
        });
        txSource.addTag("Content-Type", contentType);
        txSource.addTag("App-Name", "EM");
        txSource.addTag("Type", "Serverless");
        await arweave.transactions.sign(txSource, wallet);

        // Init Contract
        const txInit = await initContract(initState, txSource.id, wallet, arweave);

        console.log(`\nSource Contract:`, {
            id: txSource.id,
            tags: txSource.tags.map(({ name, value }: { [x: string]: string }) => ({
                name: atob(name),
                value: atob(value),
            }))
        });

        console.log(`\nInit Contract`, txInit[1]);

        const confirmation = await new Confirm('Do you want to deploy this function?').run();

        if(confirmation) {
            const txSourceDeployment = await arweave.transactions.post(txSource);
            if(txSourceDeployment.status >= 400) {
                error(`Failed to deploy source contract.`);
            } else {
                const initContractDeployment = await arweave.transactions.post(txInit[0]);
                if(initContractDeployment.status >= 400) {
                    error(`Failed to init contract. Source Contract ID: ${txSource.id}`);
                }
            }

            successfulDeployment(txSource.id, txInit[1].id);
        } else {
            console.log("\nDeployment cancelled");
        }
    } else {
        error(`Deployment requires --contract-tx or --src`);
    }

}