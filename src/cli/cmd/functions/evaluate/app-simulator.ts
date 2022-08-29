export const runExmdApp = (version: string) => {

    if(version.includes('^0.3.12') || version.includes('0.3.12')) {
        return require('three-em-0-3-12').simulateContract;
    }

    return require('three-em-0-3-09').simulateContract;

}

