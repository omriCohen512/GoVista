
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../../services/auth-service";
import "./menu.css";

export function Menu() {

    const navigate = useNavigate();
    const user = authService.getUser();

    // Remove the user's session and redirect to login.
    function logout() {
        authService.logout();
        navigate("/login");
    }

    return (
        <div className="Menu">

            <div className="menu-content">

                {/* Show login and registration links to guests. */}
                {!user &&
                    <>
                        <div className="menu-links">
                            <NavLink to="/login">Login</NavLink>
                            <NavLink to="/register">Register</NavLink>
                        </div>
                    </>
                }

                {/* Show navigation links according to the logged-in user's role. */}
                {user &&
                    <>
                        <div className="menu-links">

                            <NavLink to="/vacations">Vacations</NavLink>

                            {user.roleId === 1 &&
                                <>
                                    <NavLink to="/ai">AI Recommendation</NavLink>
                                    <NavLink to="/mcp">MCP</NavLink>
                                </>
                            }

                            {user.roleId === 2 &&
                                <>
                                    <NavLink to="/add-vacation">Add Vacation</NavLink>
                                    <NavLink to="/reports">Reports</NavLink>
                                </>
                            }

                        </div>

                        <div className="user-area">
                            <span>{user.firstName} {user.lastName}</span>
                            <button onClick={logout}>Logout</button>
                        </div>
                    </>
                }

            </div>

        </div>
    );
}
