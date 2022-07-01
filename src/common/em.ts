import {EmOpts} from "./model";

export class Em {

    constructor(opts: EmOpts) {
        if(global && !global.fetch) {
            require('isomorphic-fetch');
        }
    }

}
