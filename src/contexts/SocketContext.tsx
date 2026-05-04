import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import ExperienceService from "@/services/ExperienceService";

// ── Tipos del evento recibido por WebSocket ────────────────────────────────────
export type SocketEventType = "goal" | "goal_cancelled" | "status_changed";

export interface LiveEventData {
    match_id: number;
    side?: "home" | "away";
    period?: string;
    score?: { home: number; away: number };
    status?: string;
}

export interface LiveEvent {
    event: SocketEventType;
    resource_type: string;
    data: LiveEventData;
}

// ── Contexto ───────────────────────────────────────────────────────────────────
interface SocketContextType {
    latestEvent: LiveEvent | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    latestEvent: null,
    isConnected: false,
});

// randomUUID no existe en contextos no seguros (p. ej. http://192.168.x.x) ni en algunos navegadores viejos.
function createOpaqueSessionId(): string {
    const c = globalThis.crypto;
    if (typeof c?.randomUUID === "function") return c.randomUUID();
    if (typeof c?.getRandomValues === "function") {
        const buf = new Uint8Array(16);
        c.getRandomValues(buf);
        buf[6] = (buf[6]! & 0x0f) | 0x40;
        buf[8] = (buf[8]! & 0x3f) | 0x80;
        const h = [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");
        return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

// ── Helper: leer el sessionId de localStorage sin necesidad de un hook ─────────
function getSessionId(): string {
    const key = "wc2026_session_id";
    let id = localStorage.getItem(key);
    if (!id) {
        id = createOpaqueSessionId();
        localStorage.setItem(key, id);
    }
    return id;
}

// ── Provider ───────────────────────────────────────────────────────────────────
export function SocketProvider({ children }: { children: ReactNode }) {
    const [latestEvent, setLatestEvent] = useState<LiveEvent | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const sessionId = getSessionId();

        // Primero crear la suscripción en el backend, luego abrir el WebSocket
        ExperienceService.sport
            .createSuscription(sessionId)
            .then(() => connect(sessionId))
            .catch((err) => {
                console.error("[Socket] Error al crear suscripción:", err);
                // Intentar conectar de todas formas
                connect(sessionId);
            });

        return () => {
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
            wsRef.current?.close();
            wsRef.current = null;
        };
    }, []);

    function connect(sessionId: string) {
        if (wsRef.current && wsRef.current.readyState < WebSocket.CLOSING) return;

        const ws = ExperienceService.sport.createWebSocket(sessionId);
        wsRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const raw = JSON.parse(event.data);

                // Formato esperado: { event, resource_type, data }
                if (raw?.event && raw?.data) {
                    const liveEvent: LiveEvent = {
                        event: raw.event as SocketEventType,
                        resource_type: raw.resource_type ?? "match",
                        data: raw.data,
                    };
                    setLatestEvent(liveEvent);
                }
            } catch (e) {
                console.warn("[Socket] Mensaje no parseable:", event.data, e);
            }
        };

        ws.onerror = (err) => {
            console.error("[Socket] Error:", err);
            setIsConnected(false);
        };

        ws.onclose = (ev) => {
            setIsConnected(false);

            // Reconectar automáticamente en 5 s si el cierre no fue intencional
            if (ev.code !== 1000) {
                reconnectTimerRef.current = setTimeout(() => {
                    connect(sessionId);
                }, 5000);
            }
        };
    }

    return (
        <SocketContext.Provider value={{ latestEvent, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}

// ── Hook de consumo ────────────────────────────────────────────────────────────
export function useSocket() {
    return useContext(SocketContext);
}
