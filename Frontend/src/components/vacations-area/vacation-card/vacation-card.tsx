import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VacationModel } from "../../../models/vacation-model";
import { authService } from "../../../services/auth-service";
import { likeService } from "../../../services/like-service";
import { vacationService } from "../../../services/vacation-service";
import { appConfig } from "../../../utils/app-config";
import { notify } from "../../../utils/notify";
import "./vacation-card.css";

type VacationCardProps = {
    vacation: VacationModel;
    onLikeChange: (vacationId: number, isLiked: boolean) => void;
    onDelete?: (vacationId: number) => void;
}

export function VacationCard(props: VacationCardProps) {

    const vacation = props.vacation;
    const navigate = useNavigate();

    const [likesCount, setLikesCount] = useState(vacation.likesCount);
    const [isLiked, setIsLiked] = useState(vacation.isLiked === 1);

    const user = authService.getUser();
    const isAdmin = user?.roleId === 2;

    // Add a like and update both the card and parent component.
    async function addLike() {
        try {
            await likeService.addLike(vacation.vacationId);
            setLikesCount(likesCount + 1);
            setIsLiked(true);
            props.onLikeChange(vacation.vacationId, true);
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    // Remove a like and update both the card and parent component.
    async function deleteLike() {
        try {
            await likeService.deleteLike(vacation.vacationId);
            setLikesCount(likesCount - 1);
            setIsLiked(false);
            props.onLikeChange(vacation.vacationId, false);
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    function editVacation() {
        navigate("/edit-vacation/" + vacation.vacationId);
    }

    // Delete the vacation after confirmation and update the parent list.
    async function deleteVacation() {
        try {
            const sure = confirm("Are you sure you want to delete this vacation?");
            if (!sure) return;

            await vacationService.deleteVacation(vacation.vacationId);
            props.onDelete?.(vacation.vacationId);
            notify.success("Vacation deleted successfully.");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="VacationCard">

            <div className="vacation-image">
                <img src={appConfig.vacationsImagesUrl + vacation.imageName} alt={vacation.destination} />

                {!isAdmin &&
                    <div className="likes-badge">
                        ♥ {likesCount}
                    </div>
                }
            </div>

            <div className="vacation-content">

                <h3>{vacation.destination}</h3>

                <p className="description">{vacation.description}</p>

                <div className="vacation-dates">
                    <div>
                        <span>From</span>
                        <strong>{new Date(vacation.startDate).toLocaleDateString()}</strong>
                    </div>

                    <div>
                        <span>To</span>
                        <strong>{new Date(vacation.endDate).toLocaleDateString()}</strong>
                    </div>
                </div>

                <div className="vacation-bottom">
                    <div className="price">
                        <span>Price</span>
                        <strong>${vacation.price}</strong>
                    </div>

                    {!isAdmin &&
                        <div className="likes">
                            {likesCount} Likes
                        </div>
                    }
                </div>

                {/* Display different actions for regular users and administrators. */}
                {!isAdmin &&
                    <div className="user-buttons">
                        {isLiked ?
                            <button className="unlike-button" onClick={deleteLike}>♥ Unlike</button>
                            :
                            <button className="like-button" onClick={addLike}>♡ Like</button>
                        }
                    </div>
                }

                {isAdmin &&
                    <div className="admin-buttons">
                        <button className="edit-button" onClick={editVacation}>Edit</button>
                        <button className="delete-button" onClick={deleteVacation}>Delete</button>
                    </div>
                }

            </div>

        </div>
    );
}
