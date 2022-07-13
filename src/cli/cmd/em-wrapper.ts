import {Em} from "../../common/em";

export const getEmToken = () => process.env.TOKEN || process.env.EXM_TOKEN;

export const em = new Em({
    token: getEmToken()
});