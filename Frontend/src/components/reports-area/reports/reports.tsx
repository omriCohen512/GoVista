
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ReportModel } from "../../../models/report-model";
import { reportService } from "../../../services/report-service";
import { notify } from "../../../utils/notify";
import "./reports.css";

export function Reports() {

    const [report, setReport] = useState<ReportModel[]>([]);

    // Load vacation likes statistics when the component mounts.
    useEffect(() => {
        reportService.getVacationReport()
            .then(report => setReport(report))
            .catch(err => notify.error(err));
    }, []);

    // Download the vacation report as a CSV file.
    async function downloadCsv() {
        try {
            await reportService.downloadCsv();
        }
        catch(err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Reports">

            <div className="reports-title">
                <h2>Vacations Report</h2>
                <p>View the number of likes for each GoVista vacation.</p>
            </div>

            <div className="reports-actions">
                <button onClick={downloadCsv}>Download CSV</button>
            </div>

            <div className="chart-card">

                <div className="chart-title">
                    <h3>Vacation Likes</h3>
                    <span>Likes by destination</span>
                </div>

                {/* Display the chart only when report data is available. */}
                {report.length > 0 ?
                    <div className="chart">
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={report}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="destination"
                                    tick={{ fontSize: 12 }}
                                    interval={0}
                                    angle={-25}
                                    textAnchor="end"
                                    height={85}
                                />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar
                                    dataKey="likesCount"
                                    fill="#0077b6"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    :
                    <p className="no-report">No report data available.</p>
                }

            </div>

        </div>
    );
}
