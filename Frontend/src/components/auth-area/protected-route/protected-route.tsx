
import { Navigate } from "react-router-dom";
import { authService } from "../../../services/auth-service";
import { notify } from "../../../utils/notify";

type ProtectedRouteProps = {
    children: React.ReactNode;
}

export function ProtectedRoute(props: ProtectedRouteProps) {

    // Redirect unauthenticated users to the login page.
    if (!authService.isLoggedIn()) {
        notify.error("You must be logged in to view vacations.");
        return <Navigate to="/login" />;
    }

    // Display the requested page if the user is logged in.
    return props.children;
}
