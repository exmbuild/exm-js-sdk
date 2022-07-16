export class DeployOpFailure extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
    }
}