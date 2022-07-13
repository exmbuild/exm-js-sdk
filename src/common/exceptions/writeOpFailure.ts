export class WriteOpFailure extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
    }
}