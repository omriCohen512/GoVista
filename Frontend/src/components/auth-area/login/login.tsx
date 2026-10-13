
import "./login.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CredentialsModel } from "../../../models/credentials-model";
import { authService } from "../../../services/auth-service";
import { notify } from "../../../utils/notify";

export function Login() {

    // Manage login fields, validation and form submission.
    const { register, handleSubmit, formState } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    // Send credentials to the backend and navigate after a successful login.
    async function send(credentials: CredentialsModel) {
        try {
            await authService.login(credentials);
            notify.success("Welcome back!");
            navigate("/vacations");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Login">

            <div className="login-card">

                <div className="login-title">
                    <h2>Welcome Back</h2>
                    <p>Sign in and continue exploring with GoVista.</p>
                </div>

                <form onSubmit={handleSubmit(send)}>

                    {/* Validate the email and password before submitting. */}
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", {
                            required: { value: true, message: "Missing email." }
                        })}
                    />
                    <span>{formState.errors.email?.message}</span>

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: { value: true, message: "Missing password." },
                            minLength: { value: 4, message: "Password must be minimum 4 characters." }
                        })}
                    />
                    <span>{formState.errors.password?.message}</span>

                    <button>Login</button>

                </form>

                <div className="login-bottom">
                    <span>New to GoVista?</span>
                    <button type="button" onClick={() => navigate("/register")}>Create Account</button>
                </div>

            </div>

        </div>
    );
}
