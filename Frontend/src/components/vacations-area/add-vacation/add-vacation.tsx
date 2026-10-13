import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { VacationModel } from "../../../models/vacation-model";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";
import "./add-vacation.css";

export function AddVacation() {

    const { register, handleSubmit, formState, watch } = useForm<VacationModel>();
    const navigate = useNavigate();
    const startDate = watch("startDate");
    const today = new Date().toISOString().split("T")[0];

    // Convert the selected image to a File and send the vacation to the backend.
    async function send(vacation: VacationModel) {
        try {
            vacation.image = (vacation.image as unknown as FileList)[0];
            await vacationService.addVacation(vacation);
            notify.success("Vacation added successfully.");
            navigate("/vacations");
        }
        catch(err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="AddVacation">

            <div className="add-vacation-card">

                <div className="form-title">
                    <h2>Add Vacation</h2>
                    <p>Create a new destination for GoVista.</p>
                </div>

                <form onSubmit={handleSubmit(send)}>

                    <label>Destination</label>
                    <input
                        type="text"
                        placeholder="e.g. Rome, Italy"
                        {...register("destination", {
                            required: { value: true, message: "Missing destination." }
                        })}
                    />
                    <span>{formState.errors.destination?.message}</span>

                    <label>Description</label>
                    <textarea
                        placeholder="Describe the vacation..."
                        {...register("description", {
                            required: { value: true, message: "Missing description." }
                        })}
                    />
                    <span>{formState.errors.description?.message}</span>

                    {/* Restrict vacation dates and prevent the end date from preceding the start date. */}
                    <div className="date-row">

                        <div>
                            <label>Start Date</label>
                            <input
                                type="date"
                                min={today}
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
                                min={startDate || today}
                                {...register("endDate", {
                                    required: { value: true, message: "Missing end date." }
                                })}
                            />
                            <span>{formState.errors.endDate?.message}</span>
                        </div>

                    </div>

                    {/* Convert the price to a number and validate its allowed range. */}
                    <label>Price</label>
                    <input
                        type="number"
                        placeholder="Price in USD"
                        {...register("price", {
                            required: { value: true, message: "Missing price." },
                            min: { value: 0, message: "Price can't be negative." },
                            max: { value: 10000, message: "Price can't exceed $10,000." },
                            valueAsNumber: true
                        })}
                    />
                    <span>{formState.errors.price?.message}</span>

                    {/* Accept an image file for the new vacation. */}
                    <label>Vacation Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("image")}
                        required
                    />

                    <button>Add Vacation</button>

                </form>

            </div>

        </div>
    );
}
