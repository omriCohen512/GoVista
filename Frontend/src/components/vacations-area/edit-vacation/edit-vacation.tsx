
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { VacationModel } from "../../../models/vacation-model";
import { vacationService } from "../../../services/vacation-service";
import { appConfig } from "../../../utils/app-config";
import { notify } from "../../../utils/notify";
import "./edit-vacation.css";

export function EditVacation() {

    const { register, handleSubmit, reset, formState, watch } = useForm<VacationModel>();
    const navigate = useNavigate();
    const params = useParams();
    const vacationId = Number(params.vacationId);
    const startDate = watch("startDate");

    const [imageName, setImageName] = useState<string>("");

    // Load the vacation and populate the form with its existing data.
    useEffect(() => {
        vacationService.getOneVacation(vacationId)
            .then(vacation => {
                vacation.startDate = vacation.startDate.toString().split("T")[0];
                vacation.endDate = vacation.endDate.toString().split("T")[0];
                setImageName(vacation.imageName);
                reset(vacation);
            })
            .catch(err => notify.error(err));
    }, []);

    // Update the vacation and include a replacement image if selected.
    async function send(vacation: VacationModel) {
        try {
            vacation.vacationId = vacationId;

            if (vacation.image) {
                vacation.image = (vacation.image as unknown as FileList)[0];
            }

            await vacationService.updateVacation(vacation);
            notify.success("Vacation updated successfully.");
            navigate("/vacations");
        }
        catch(err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="EditVacation">

            <div className="edit-vacation-card">

                <div className="form-title">
                    <h2>Edit Vacation</h2>
                    <p>Update the vacation details.</p>
                </div>

                {/* Display the existing image before the administrator replaces it. */}
                {imageName &&
                    <div className="current-image">
                        <span>Current Image</span>
                        <img
                            src={appConfig.vacationsImagesUrl + imageName}
                            alt="Current vacation"
                        />
                    </div>
                }

                <form onSubmit={handleSubmit(send)}>

                    <label>Destination</label>
                    <input
                        type="text"
                        {...register("destination", {
                            required: { value: true, message: "Missing destination." }
                        })}
                    />
                    <span>{formState.errors.destination?.message}</span>

                    <label>Description</label>
                    <textarea
                        {...register("description", {
                            required: { value: true, message: "Missing description." }
                        })}
                    />
                    <span>{formState.errors.description?.message}</span>

                    {/* Prevent the end date from being earlier than the start date. */}
                    <div className="date-row">

                        <div>
                            <label>Start Date</label>
                            <input
                                type="date"
                                {...register("startDate", {
                                    required: { value: true, message: "Missing start date." }
                                })}
                            />
                            <span>{formState.errors.startDate?.message}</span>
                        </div>

                        <div>
                            <label>End Date</label>
                            <input
                                type="date"
                                min={startDate}
                                {...register("endDate", {
                                    required: { value: true, message: "Missing end date." }
                                })}
                            />
                            <span>{formState.errors.endDate?.message}</span>
                        </div>

                    </div>

                    <label>Price</label>
                    <input
                        type="number"
                        {...register("price", {
                            required: { value: true, message: "Missing price." },
                            min: { value: 0, message: "Price can't be negative." },
                            max: { value: 10000, message: "Price can't exceed $10,000." },
                            valueAsNumber: true
                        })}
                    />
                    <span>{formState.errors.price?.message}</span>

                    <label>Replace Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("image")}
                    />

                    <button>Update Vacation</button>

                </form>

            </div>

        </div>
    );
}
