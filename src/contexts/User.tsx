import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import ClientService from "@/services/ClientService";
import {
    clearAuthCookies,
    getAuthToken,
    getClientIdentification,
    setClientIdentification,
} from "@/lib/authCookies";
import ExperienceService from "@/services/ExperienceService";

interface UserData {
    id: number;
    identificacion: string;
    nombre1?: string;
    nombre2?: string;
    apellido1?: string;
    apellido2?: string;
    correo?: string;
    telefono1?: string;
    telefono2?: string;
    fechaCreacion?: string;
    tipoContribuyente?: {
        id: number;
        descripcion: string;
    };
    tipoIdentificacion?: {
        id: number;
        descripcion: string;
        valor_identificacion: string;
    };
}

interface UserPrediction {
    id: string;
    match: number | string | { id?: number | string };
    homeScore: number;
    awayScore: number;
    puntuation: number;
}

interface UserPuntuation {
    user: number | string;
    name: string;
    total_score: number;
    position: number;
}

interface UserContextType {
    user: UserData | null;
    isLoading: boolean;
    isInitializing: boolean;
    error: string | null;
    login: (cedula: string) => Promise<boolean>;
    logout: () => void;
    upsertUserPrediction: (prediction: UserPrediction) => void;
    userPredictions: UserPrediction[];
    userPuntuation: UserPuntuation | null
}

const UserContext = createContext<UserContextType | null>(null);

function resolvePredictionMatchId(prediction: UserPrediction): string | null {
    const raw = prediction.match;
    if (raw == null) return null;
    if (typeof raw === "object" && "id" in raw) {
        const id = raw.id;
        return id == null ? null : String(id);
    }
    return String(raw);
}


export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([]);
    const [userPuntuation, setUserPuntuation] = useState<UserPuntuation | null>(null);



    const restoreSession = useCallback(async () => {
        const token = getAuthToken();
        const identificacion = getClientIdentification();

        if (!token || !identificacion) {
            if (!token && identificacion) {
                clearAuthCookies();
            }
            return;
        }

        try {
            const res = await ClientService.consultByIdentification(identificacion);
            if (res.success && res.cliente) {
                setUser(res.cliente);
                setClientIdentification(identificacion);
            } else {
                clearAuthCookies();
            }
        } catch {
            clearAuthCookies();
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            await restoreSession();
            if (!cancelled) {
                setIsInitializing(false);
            }
        };

        init();

        return () => {
            cancelled = true;
        };
    }, [restoreSession]);

    useEffect(() => {
        if (!user)
            return;
        ExperienceService.sport.consultUserPredictions(user.id).then((res) => {
            const raw = res.data;
            const list = Array.isArray(raw) ? raw : raw?.items ?? raw?.predictions ?? [];
            setUserPredictions(Array.isArray(list) ? list : []);
        }).catch((e) => console.error(e));
        ExperienceService.sport.consultUserPuntuation(user.id).then((res) => {
            setUserPuntuation(res.data)
        });
    }, [user])

    const login = async (cedula: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await ClientService.consultByIdentification(cedula);
            if (res.success && res.cliente) {
                setUser(res.cliente);
                setClientIdentification(cedula.trim());
                return true;
            }
            setError(res.message ?? "No se encontró un usuario con esa cédula.");
            return false;
        } catch {
            setError("No se encontró un usuario con esa cédula o no cuenta con el servicio.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        clearAuthCookies();
        setUser(null);
        setError(null);
        setUserPredictions([]);
        setUserPuntuation(null);
    };

    const upsertUserPrediction = useCallback((prediction: UserPrediction) => {
        setUserPredictions((prev) => {
            const nextMatchId = resolvePredictionMatchId(prediction);
            const exists = prev.some((current) => {
                const currentMatchId = resolvePredictionMatchId(current);
                if (nextMatchId && currentMatchId) return currentMatchId === nextMatchId;
                return String(current.id) === String(prediction.id);
            });

            if (!exists) return [prediction, ...prev];

            return prev.map((current) => {
                const currentMatchId = resolvePredictionMatchId(current);
                if (nextMatchId && currentMatchId) {
                    return currentMatchId === nextMatchId ? prediction : current;
                }
                return String(current.id) === String(prediction.id) ? prediction : current;
            });
        });
    }, []);

    return (
        <UserContext.Provider
            value={{ user, isLoading, isInitializing, error, login, logout, upsertUserPrediction, userPredictions, userPuntuation }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
}
