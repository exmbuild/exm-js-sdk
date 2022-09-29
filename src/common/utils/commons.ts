import {ContractType} from "../model";

export const postRequest = (url: string, body: any) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}

export const guidGenerator = () => {
    const S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export const figureOutContractType = (input: string | undefined, byType: boolean): ContractType => {
    let contentType: ContractType = ContractType.JS;
    if(input) {
        const lowerCaseInput = input.toLowerCase();

        if (byType) {
            switch (lowerCaseInput) {
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
            if (lowerCaseInput.endsWith(".js")) {
                contentType = ContractType.JS;
            } else if (lowerCaseInput.endsWith(".wasm")) {
                contentType = ContractType.WASM;
            } else {
                contentType = ContractType.JS;
            }
        }
    }

    return contentType;
}