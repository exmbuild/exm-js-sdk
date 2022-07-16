import {Exm} from "../../common/em";

export const getEmToken = () => process.env.EXM_TOKEN || process.env.TOKEN;

export const em = new Exm({
    token: getEmToken()
});