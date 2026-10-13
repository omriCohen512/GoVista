import axios from "axios";
import { ReportModel } from "../models/report-model";
import { appConfig } from "../utils/app-config";

class ReportService {

    public async getVacationReport(): Promise<ReportModel[]> {
        const response = await axios.get<ReportModel[]>(appConfig.vacationsUrl + "/report");
        return response.data;
    }

    public async downloadCsv(): Promise<void> {

        const response = await axios.get(appConfig.vacationsUrl + "/report/csv", {
            responseType: "blob"
        });

        const url = URL.createObjectURL(response.data);

        const a = document.createElement("a");
        a.href = url;
        a.download = "vacations-report.csv";
        a.click();

        URL.revokeObjectURL(url);
    }
}

export const reportService = new ReportService();