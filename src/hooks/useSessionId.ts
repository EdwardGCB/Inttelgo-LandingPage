import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

export function useSessionId(): string {
    return useMemo(() => {
        const key = "wc2026_session_id";
        let id = localStorage.getItem(key);
        if (!id) {
            id = uuidv4();
            localStorage.setItem(key, id);
        }
        return id;
    }, []);
}