
import { OkPacketParams } from "mysql2";
import { saver } from "smart-saver";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enums";
import { VacationModel } from "../models/vacation-model";
import { dal } from "../utils/dal";

// Contains vacation business logic and database operations:
class VacationService {

    // Get all vacations with their like counts and the current user's like status:
    public async getAllVacations(userId: number): Promise<VacationModel[]> {

        // LEFT JOIN includes vacations without likes, and EXISTS checks if the user liked each vacation:
        const sql = `
            select v.*, count(l.userId) as likesCount,
            exists(select * from likes where userId = ? and vacationId = v.vacationId) as isLiked
            from vacations as v
            left join likes as l on v.vacationId = l.vacationId
            group by v.vacationId
            order by v.startDate
        `;
        const values = [userId];
        const vacations = await dal.execute(sql, values) as VacationModel[];
        return vacations;
    }

    // Get a vacation by its ID:
    public async getOneVacation(vacationId: number): Promise<VacationModel> {
        const sql = "select * from vacations where vacationId = ?";
        const values = [vacationId];
        const vacations = await dal.execute(sql, values) as VacationModel[];
        const vacation = vacations[0];

        // Throw a 404 error if the vacation doesn't exist:
        if (!vacation) {
            throw new ClientError(StatusCode.NotFound, `Vacation ${vacationId} not found.`);
        }

        return vacation;
    }

    // Add a new vacation:
    public async addVacation(vacation: VacationModel): Promise<VacationModel> {

        // Validate vacation fields and require an image:
        vacation.validate();

        if (!vacation.image) {
            throw new ClientError(StatusCode.BadRequest, "Image is required.");
        }

        // Remove the time portion so vacations can start today:
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(vacation.startDate);
        const endDate = new Date(vacation.endDate);

        // Prevent past start dates and end dates before the start date:
        if (startDate < today) {
            throw new ClientError(StatusCode.BadRequest, "Start date cannot be in the past.");
        }

        if (endDate < startDate) {
            throw new ClientError(StatusCode.BadRequest, "End date cannot be before start date.");
        }

        // Save the uploaded image and receive its generated filename:
        const imageName = await saver.save(vacation.image);

        if (!imageName) {
            throw new ClientError(StatusCode.InternalServerError, "Image save failed.");
        }

        // Insert vacation data and save only the image filename in MySQL:
        const sql = `
            insert into vacations(destination, description, startDate, endDate, price, imageName)
            values(?, ?, ?, ?, ?, ?)
        `;

        const values = [
            vacation.destination,
            vacation.description,
            vacation.startDate,
            vacation.endDate,
            vacation.price,
            imageName
        ];

        const info = await dal.execute(sql, values) as OkPacketParams;

        // Set the generated ID and initial like information:
        vacation.vacationId = info.insertId!;
        vacation.imageName = imageName;
        vacation.likesCount = 0;
        vacation.isLiked = false;
        vacation.image = undefined!;

        return vacation;
    }

    // Update an existing vacation:
    public async updateVacation(vacation: VacationModel): Promise<VacationModel> {

        vacation.validate();

        // Allow past dates when editing, but prevent an end date before the start date:
        const startDate = new Date(vacation.startDate);
        const endDate = new Date(vacation.endDate);

        if (endDate < startDate) {
            throw new ClientError(StatusCode.BadRequest, "End date cannot be before start date.");
        }

        // Get the existing image and verify that the vacation exists:
        const oldImageName = await this.getImageName(vacation.vacationId);

        if (!oldImageName) {
            throw new ClientError(StatusCode.NotFound, `Vacation ${vacation.vacationId} not found.`);
        }

        // Keep the original image unless the admin uploads a new one:
        let imageName = oldImageName;

        if (vacation.image) {
            const updatedImageName = await saver.update(vacation.image, oldImageName);

            if (!updatedImageName) {
                throw new ClientError(StatusCode.InternalServerError, "Image update failed.");
            }

            imageName = updatedImageName;
        }

        // Update the vacation record in MySQL:
        const sql = `
            update vacations set
            destination = ?,
            description = ?,
            startDate = ?,
            endDate = ?,
            price = ?,
            imageName = ?
            where vacationId = ?
        `;

        const values = [
            vacation.destination,
            vacation.description,
            vacation.startDate,
            vacation.endDate,
            vacation.price,
            imageName,
            vacation.vacationId
        ];

        const info = await dal.execute(sql, values) as OkPacketParams;

        // affectedRows indicates whether MySQL found a record to update:
        if (info.affectedRows === 0) {
            throw new ClientError(StatusCode.NotFound, `Vacation ${vacation.vacationId} not found.`);
        }

        const dbVacation = await this.getOneVacation(vacation.vacationId);
        return dbVacation;
    }

    // Delete a vacation and its image:
    public async deleteVacation(vacationId: number): Promise<void> {

        // Get the image filename before deleting the database record:
        const imageName = await this.getImageName(vacationId);

        const sql = "delete from vacations where vacationId = ?";
        const values = [vacationId];

        const info = await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ClientError(StatusCode.NotFound, `Vacation ${vacationId} not found.`);
        }

        // Remove the image file after successfully deleting the vacation:
        if (imageName) {
            await saver.delete(imageName);
        }
    }

    // Get the image filename of a specific vacation:
    private async getImageName(vacationId: number): Promise<string | null> {
        const sql = "select imageName from vacations where vacationId = ?";
        const values = [vacationId];
        const vacations = await dal.execute(sql, values) as VacationModel[];
        const vacation = vacations[0];

        if (!vacation) return null;

        return vacation.imageName;
    }

    // Get the number of likes for each vacation for the admin report:
    public async getVacationReport(): Promise<any[]> {

        // LEFT JOIN includes vacations with zero likes:
        const sql = `
            select v.destination, count(l.userId) as likesCount
            from vacations as v
            left join likes as l on v.vacationId = l.vacationId
            group by v.vacationId, v.destination
            order by v.destination
        `;

        const report = await dal.execute(sql) as any[];
        return report;
    }

    // Convert the vacation likes report into a downloadable CSV string:
    public async getVacationReportCsv(): Promise<string> {
        const report = await this.getVacationReport();
        let csv = "Destination,Likes\n";

        // Add each vacation as a separate CSV row:
        for (const item of report) {
            csv += `"${item.destination}",${item.likesCount}\n`;
        }

        return csv;
    }

}

export const vacationService = new VacationService();
