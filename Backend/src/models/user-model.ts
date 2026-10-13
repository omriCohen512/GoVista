
import z from "zod";
import { ClientError } from "./client-error";
import { Role, StatusCode } from "./enums";

// User validation rules:
const UserSchema = z.object({
    userId: z.number().int().positive().optional(),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.email().max(100),
    password: z.string().min(4).max(255),
    roleId: z.enum(Role).optional()
});

// Create a TypeScript type based on the validation schema:
type IUserModel = z.infer<typeof UserSchema>;

// Represents a user in the system:
export class UserModel implements IUserModel {

    public userId: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public roleId: Role;

    public constructor(user: UserModel) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.roleId = user.roleId;
    }

    // Validate user data and throw an error if invalid:
    public validate(): void {
        const result = UserSchema.safeParse(this);

        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }

}
