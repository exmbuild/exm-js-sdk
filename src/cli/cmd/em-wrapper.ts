import {Exm} from "../../common/em";

export const getEmToken = () => process.env.TOKEN || process.env.EXM_TOKEN;

export const em = new Exm({
    token: getEmToken()
});