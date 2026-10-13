
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../../models/user-model";
import { authService } from "../../../services/auth-service";
import { notify } from "../../../utils/notify";
import "./register.css";

export function Register() {

    // Manage registration fields, validation and form submission.
    const { register, handleSubmit, formState } = useForm<UserModel>();
    const navigate = useNavigate();

    // Register the user and navigate after successful registration.
    async function send(user: UserModel) {
        try {
            await authService.register(user);
            notify.success("Welcome!");
            navigate("/vacations");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="Register">

            <div className="register-card">

                <div className="register-title">
                    <h2>Join GoVista</h2>
                    <p>Create your account and start discovering your next vacation.</p>
                </div>

                <form onSubmit={handleSubmit(send)}>

                    {/* Validate the user's personal information. */}
                    <div className="name-row">

                        <div>
                            <label>First Name</label>
                            <input
                                type="text"
                                placeholder="First name"
                                {...register("firstName", {
                                    required: { value: true, message: "Missing first name." }
                                })}
                            />
                            <span>{formState.errors.firstName?.message}</span>
                        </div>

                        <div>
                            <label>Last Name</label>
                            <input
                                type="text"
                                placeholder="Last name"
                                {...register("lastName", {
                                    required: { value: true, message: "Missing last name." }
                                })}
                            />
                            <span>{formState.errors.lastName?.message}</span>
                        </div>

                    </div>

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
                        placeholder="Minimum 4 characters"
                        {...register("password", {
                            required: { value: true, message: "Missing password." },
                            minLength: { value: 4, message: "Password must be minimum 4 characters." }
                        })}
                    />
                    <span>{formState.errors.password?.message}</span>

                    <button>Register</button>

                </form>

                <div className="register-bottom">
                    <span>Already have an account?</span>
                    <button type="button" onClick={() => navigate("/login")}>Login</button>
                </div>

            </div>

        </div>
    );
}
