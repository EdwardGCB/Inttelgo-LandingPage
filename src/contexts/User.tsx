import { createContext, useContext, useState, type ReactNode } from "react";
import ClientService from "@/services/ClientService";

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

interface UserContextType {
    user: UserData | null;
    isLoading: boolean;
    error: string | null;
    login: (cedula: string) => Promise<boolean>;
    logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (cedula: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await ClientService.consultByIdentification(cedula);
            if (res.success) {
                setUser(res.cliente);
                return true;
            } else {
                setError(res.message ?? "No se encontró un usuario con esa cédula.");
                return false;
            }
        } catch {
            setError("No se encontró un usuario con esa cédula o no cuenta con el servicio.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setError(null);
    };

    return (
        <UserContext.Provider value={{ user, isLoading, error, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
}
