
import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Login credentials validation rules:
const CredentialsSchema = z.object({
    email: z.email().max(100),
    password: z.string().min(4).max(255)
});

// Create a TypeScript type from the Zod schema:
type ICredentialsModel = z.infer<typeof CredentialsSchema>;

// Represents the credentials submitted during login:
export class CredentialsModel implements ICredentialsModel {

    public email: string;
    public password: string;

    public constructor(credentials: CredentialsModel) {
        this.email = credentials.email;
        this.password = credentials.password;
    }

    // Validate login credentials and throw an error if invalid:
    public validate(): void {
        const result = CredentialsSchema.safeParse(this);

        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }

}
