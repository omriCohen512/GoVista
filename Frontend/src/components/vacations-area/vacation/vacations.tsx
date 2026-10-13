
import { useEffect, useState } from "react";
import { VacationModel } from "../../../models/vacation-model";
import { authService } from "../../../services/auth-service";
import { vacationService } from "../../../services/vacation-service";
import { notify } from "../../../utils/notify";
import { VacationCard } from "../vacation-card/vacation-card";
import "./vacations.css";

export function Vacations() {

    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [filter, setFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const vacationsPerPage = 9;
    const now = new Date();
    const user = authService.getUser();

    // Load vacations from the backend when the component mounts.
    useEffect(() => {
        vacationService.getAllVacations()
            .then(vacations => setVacations(vacations))
            .catch(err => notify.error(err));
    }, []);

    // Filter vacations according to the selected category.
    const filteredVacations = vacations.filter(v => {
        if (filter === "liked") return v.isLiked === 1;
        if (filter === "active") return new Date(v.startDate) <= now && new Date(v.endDate) >= now;
        if (filter === "upcoming") return new Date(v.startDate) > now;
        return true;
    });

    // Calculate the number of pages and vacations displayed on the current page.
    const totalPages = Math.ceil(filteredVacations.length / vacationsPerPage);
    const startIndex = (currentPage - 1) * vacationsPerPage;
    const currentVacations = filteredVacations.slice(startIndex, startIndex + vacationsPerPage);

    function changeFilter(filterName: string) {
        setFilter(filterName);
        setCurrentPage(1);
    }

    // Update the liked status of the selected vacation without reloading the list.
    function updateLike(vacationId: number, isLiked: boolean) {
        setVacations(vacations.map(v =>
            v.vacationId === vacationId ? { ...v, isLiked: isLiked ? 1 : 0 } : v
        ));
    }

    // Remove a deleted vacation from the displayed list.
    function deleteVacation(vacationId: number) {
        setVacations(vacations.filter(v => v.vacationId !== vacationId));
    }

    return (
        <div className="Vacations">

            <h2>Vacations</h2>

            <div className="filters">
                <button onClick={() => changeFilter("all")}>All Vacations</button>

                {user?.roleId === 1 &&
                    <button onClick={() => changeFilter("liked")}>My Likes</button>
                }

                <button onClick={() => changeFilter("active")}>Active Now</button>
                <button onClick={() => changeFilter("upcoming")}>Upcoming</button>
            </div>

            <div className="vacations-list">
                {currentVacations.map(v => <VacationCard key={v.vacationId} vacation={v} onLikeChange={updateLike} onDelete={deleteVacation} />)}
            </div>

            {filteredVacations.length === 0 && <p>No vacations found.</p>}

            {totalPages > 1 &&
                <div className="pagination">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) =>
                        <button
                            key={i + 1}
                            className={currentPage === i + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                        </button>
                    )}

                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                        Next
                    </button>
                </div>
            }

        </div>
    );
}
