
import axios, { InternalAxiosRequestConfig } from "axios";

class Interceptor {

    public create(): void {

        // Add a request interceptor to attach the JWT to HTTP requests.
        axios.interceptors.request.use((httpRequest: InternalAxiosRequestConfig) => {

            const token = localStorage.getItem("token");

            // Add the token to the Authorization header if it exists.
            if (token) {
                httpRequest.headers.Authorization = "Bearer " + token;
            }

            return httpRequest;
        });

    }

}

export const interceptor = new Interceptor();
