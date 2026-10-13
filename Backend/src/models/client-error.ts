
import { StatusCode } from "./enums";

// Represents an application error with an HTTP status and message:
export class ClientError {

    public readonly status: StatusCode;
    public readonly message: string;

    // Initialize the error details:
    public constructor(status: StatusCode, message: string) {
        this.status = status;
        this.message = message;
    }

}
