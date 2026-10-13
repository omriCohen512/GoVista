
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/auth-service";
import "./page404.css";

export function Page404() {

    const navigate = useNavigate();
    const user = authService.getUser();

    // Redirect logged-in users to vacations and guests to login.
    function goBack() {
        if (user) {
            navigate("/vacations");
        }
        else {
            navigate("/login");
        }
    }

    return (
        <div className="Page404">

            <div className="page404-card">

                <div className="page404-number">404</div>

                <h2>Destination Not Found</h2>

                <p>
                    Looks like this destination isn't on the GoVista map.
                </p>

                <button onClick={goBack}>
                    {user ? "Back to Vacations" : "Back to Login"}
                </button>

            </div>

        </div>
    );
}
