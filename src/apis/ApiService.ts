import axios from "axios";
import type {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosRequestConfig
} from "axios";

const extractToken = () => {
    const entry = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("token="));
    if (!entry) return undefined;
    return decodeURIComponent(entry.substring("token=".length));
};

const persistToken = (token: string) => {
    const cookieParts = [
        `token=${encodeURIComponent(token)}`,
        "path=/",
        "SameSite=Strict",
    ];
    if (window.location.protocol === "https:") cookieParts.push("Secure");
    document.cookie = cookieParts.join("; ");
};


const extractPSEToken = () => {
    const entry = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("pse_token="));
    if (!entry) return undefined;
    return decodeURIComponent(entry.substring("pse_token=".length));
};

const persistPSEToken = (token: string) => {
    const cookieParts = [
        `pse_token=${encodeURIComponent(token)}`,
        "path=/",
        "SameSite=Strict",
    ];
    if (window.location.protocol === "https:") cookieParts.push("Secure");
    document.cookie = cookieParts.join("; ");
};

class ApiService {
    private api: AxiosInstance;

    constructor(baseURL: string) {
        this.api = axios.create({
            baseURL,
            withCredentials: true,
        });

        // Interceptor de request: adjunta ambos tokens sin sobreescribirse
        this.api.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const inttelgoToken = extractToken();
                const pseToken = extractPSEToken();

                // Token de Inttelgo → Authorization: Bearer (para rutas con authRequired)
                if (inttelgoToken) {
                    config.headers.Authorization = `Bearer ${inttelgoToken}`;
                }

                // Token PSE → header custom (para rutas con pseTokenRequired)
                if (pseToken) {
                    config.headers["pse_token"] = pseToken;
                }

                config.withCredentials = true;
                return config;
            },
            (error: AxiosError) => Promise.reject(error)
        );

        // Interceptor de response: actualiza cookies cuando llegan nuevos tokens
        this.api.interceptors.response.use(
            (response) => {
                const inttelgoToken = response.data?.token ?? null;
                if (inttelgoToken && typeof inttelgoToken === "string") {
                    persistToken(inttelgoToken);
                }

                const pseToken = response.data?.pse_token ?? null;
                if (pseToken && typeof pseToken === "string") {
                    persistPSEToken(pseToken);
                }

                return response;
            },
            (error: AxiosError) => Promise.reject(error)
        );
    }

    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.api.get<T>(url, config).then(response => response.data);
    }

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.api.post<T>(url, data, config).then(response => response.data);
    }

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return this.api.put<T>(url, data, config).then(response => response.data);
    }

    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.api.delete<T>(url, config).then(response => response.data);
    }

    // Método adicional para obtener la instancia completa de axios si se necesita
    getInstance(): AxiosInstance {
        return this.api;
    }
}

export default new ApiService(import.meta.env.VITE_API_URL);