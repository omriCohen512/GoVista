
import { Navigate } from "react-router-dom";
import { authService } from "../../../services/auth-service";

type AdminRouteProps = {
    children: React.ReactNode;
}

export function AdminRoute(props: AdminRouteProps) {

    const user = authService.getUser();

    // Redirect guests to login and non-admin users to vacations.
    if (!user) return <Navigate to="/login" />;
    if (user.roleId !== 2) return <Navigate to="/vacations" />;

    // Display the requested page only for administrators.
    return props.children;
}
