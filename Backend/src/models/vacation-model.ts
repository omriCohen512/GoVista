
import { UploadedFile } from "express-fileupload";
import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enums";

// Vacation validation rules:
const VacationSchema = z.object({
    vacationId: z.number().int().positive().optional(),
    destination: z.string().min(2).max(100),
    description: z.string().min(2).max(1000),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    price: z.number().min(0).max(10000),
    imageName: z.string().optional(),
    image: z.custom<UploadedFile>().optional(),
    likesCount: z.number().optional(),
    isLiked: z.boolean().optional()
});

// Vacation model:
export class VacationModel {

    // Vacation properties:
    public vacationId: number;
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public imageName: string;
    public image: UploadedFile;
    public likesCount: number;
    public isLiked: boolean;

    // Initialize vacation properties:
    public constructor(vacation: VacationModel) {
        this.vacationId = vacation.vacationId;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = +vacation.price;
        this.imageName = vacation.imageName;
        this.image = vacation.image;
        this.likesCount = vacation.likesCount;
        this.isLiked = vacation.isLiked;
    }

    // Validate vacation data:
    public validate(): void {

        // Check the vacation against the schema:
        const result = VacationSchema.safeParse(this);

        // Throw an error if validation fails:
        if (!result.success) {
            const message = result.error.issues[0].path + ": " + result.error.issues[0].message;
            throw new ClientError(StatusCode.UnprocessableContent, message);
        }
    }

}
