
import axios from "axios";
import { VacationModel } from "../models/vacation-model";
import { appConfig } from "../utils/app-config";

class VacationService {

    public async getAllVacations(): Promise<VacationModel[]> {
        const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);
        return response.data;
    }

    public async getOneVacation(vacationId: number): Promise<VacationModel> {
        const response = await axios.get<VacationModel>(appConfig.vacationsUrl + "/" + vacationId);
        return response.data;
    }

    // Convert vacation data to FormData before sending it with an image.
    public async addVacation(vacation: VacationModel): Promise<void> {
        const formData = this.toFormData(vacation);
        await axios.post(appConfig.vacationsUrl, formData);
    }

    public async updateVacation(vacation: VacationModel): Promise<void> {
        const formData = this.toFormData(vacation);
        await axios.put(appConfig.vacationsUrl + "/" + vacation.vacationId, formData);
    }

    public async deleteVacation(vacationId: number): Promise<void> {
        await axios.delete(appConfig.vacationsUrl + "/" + vacationId);
    }

    // Build the multipart form data expected by the backend.
    private toFormData(vacation: VacationModel): FormData {
        const formData = new FormData();
        formData.append("destination", vacation.destination);
        formData.append("description", vacation.description);
        formData.append("startDate", vacation.startDate);
        formData.append("endDate", vacation.endDate);
        formData.append("price", vacation.price.toString());

        // Include the image only when a new file was selected.
        if (vacation.image) {
            formData.append("image", vacation.image);
        }

        return formData;
    }

}

export const vacationService = new VacationService();
