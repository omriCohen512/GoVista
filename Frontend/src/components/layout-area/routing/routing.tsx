
import { Navigate, Route, Routes } from "react-router-dom";
import { AiRecommendation } from "../../ai-area/ai-recommendation/ai-recommendation";
import { AdminRoute } from "../../auth-area/admin-route/admin-route";
import { Login } from "../../auth-area/login/login";
import { ProtectedRoute } from "../../auth-area/protected-route/protected-route";
import { Register } from "../../auth-area/register/register";
import { Mcp } from "../../mcp-area/mcp/mcp";
import { Page404 } from "../../pages-area/page404/page404";
import { Reports } from "../../reports-area/reports/reports";
import { AddVacation } from "../../vacations-area/add-vacation/add-vacation";
import { EditVacation } from "../../vacations-area/edit-vacation/edit-vacation";
import { Vacations } from "../../vacations-area/vacation/vacations";

export function Routing() {

    return (
        <Routes>

            {/* Redirect the homepage to the login page. */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public pages available without authentication. */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Pages available to authenticated users. */}
            <Route path="/vacations" element={
                <ProtectedRoute>
                    <Vacations />
                </ProtectedRoute>
            } />

            <Route path="/ai" element={
                <ProtectedRoute>
                    <AiRecommendation />
                </ProtectedRoute>
            } />

            <Route path="/mcp" element={
                <ProtectedRoute>
                    <Mcp />
                </ProtectedRoute>
            } />

            {/* Pages restricted to administrators. */}
            <Route path="/add-vacation" element={
                <AdminRoute>
                    <AddVacation />
                </AdminRoute>
            } />

            <Route path="/edit-vacation/:vacationId" element={
                <AdminRoute>
                    <EditVacation />
                </AdminRoute>
            } />

            <Route path="/reports" element={
                <AdminRoute>
                    <Reports />
                </AdminRoute>
            } />

            {/* Display a 404 page when no route matches. */}
            <Route path="*" element={<Page404 />} />

        </Routes>
    );
}
