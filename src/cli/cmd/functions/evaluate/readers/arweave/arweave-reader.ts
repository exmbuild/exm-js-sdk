import {BundleQueryResponse, ReaderInterface} from "../reader.interface";
import {BundleBody} from "../../common";
import {postRequest} from "../../../../../../common/utils/commons";
import GQLResultInterface from "./graphql";

export interface Paginator {
    exmFunctionId: string;
    after?: string;
}

export class ArweaveReader implements ReaderInterface<Paginator, String> {

    async fetchBundles(paginator: Paginator): Promise<BundleQueryResponse<String>[]> {
        const req = await postRequest(`https://arweave.net/graphql`, this.buildGqlQuery(paginator.exmFunctionId, paginator.after));
        const jsonResp: GQLResultInterface = await req.json();
        return jsonResp.data.transactions.edges.map((i) => ({
            id: i.node.id,
            pseudoTimestamp: Number(i.node.tags.find((tag) => tag.name === 'Pseudo-Timestamp')!.value),
            functionId: (i.node?.tags || []).find((tag) => tag.name === 'Function')!.value,
            blockHeight: i.node?.block?.height || 0,
            threeEmExecutorVersion: (i.node?.tags || []).find((tag) => tag.name === '3EM-Executor-Version')?.value!,
            after: i.cursor,
            isExmFunctionExmDeployed: (i.node?.tags || []).find((tag) => tag.name === '3EM-Function-Deployed')?.value === 'true' || true
        }));
    }

    private buildGqlQuery(exmFunctionId: string, after?: string) {
        const query = `# Write your query or mutation here
            query {
              transactions(
                tags: [{ name: "App-Name", values: ["EM"] }, { name: "Type", values: ["Serverless"] }, { name: "Function", values: ["${exmFunctionId}"] }]
                owners: ["kljUVhFCOmFqIow8veT8WYFu65RrOcfzL3m672eatao"]
                sort: HEIGHT_ASC
                first: 100
                ${after ? `after: "${after}"` : ''}
              ) {
                edges {
                  node {
                    id
                    owner {
                      address
                    }
                    block {
                      height
                    }
                    tags {
                      name
                      value
                    }
                  }
                  cursor
                }
                pageInfo {
                  hasNextPage
                }
              }
            }`;
        return {
            query,
            variables: {}
        }
    }

}