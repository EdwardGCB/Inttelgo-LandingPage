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
        console.info("[Socket] Iniciando — sessionId:", sessionId);

        // Primero crear la suscripción en el backend, luego abrir el WebSocket
        ExperienceService.sport
            .createSuscription(sessionId)
            .then((res) => {
                console.info("[Socket] Suscripción creada correctamente:", res);
                connect(sessionId);
            })
            .catch((err) => {
                console.error("[Socket] Error al crear suscripción:", err);
                // Intentar conectar de todas formas
                connect(sessionId);
            });

        return () => {
            console.info("[Socket] Limpiando — cerrando conexión y timers");
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
            wsRef.current?.close(1000, "Component unmounted");
            wsRef.current = null;
        };
    }, []);

    function connect(sessionId: string) {
        if (wsRef.current && wsRef.current.readyState < WebSocket.CLOSING) {
            console.warn("[Socket] Ya existe una conexión activa, readyState:", wsRef.current.readyState);
            return;
        }

        const ws = ExperienceService.sport.createWebSocket(sessionId);
        console.info("[Socket] Creando WebSocket — URL:", (ws as WebSocket).url ?? "desconocida");
        wsRef.current = ws;

        ws.onopen = () => {
            console.info("[Socket] Conexión abierta ✓ — sessionId:", sessionId);
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            console.debug("[Socket] Mensaje recibido (raw):", event.data);
            try {
                const raw = JSON.parse(event.data);
                console.debug("[Socket] Mensaje parseado:", raw);

                // Formato esperado: { event, resource_type, data }
                if (raw?.event && raw?.data) {
                    const liveEvent: LiveEvent = {
                        event: raw.event as SocketEventType,
                        resource_type: raw.resource_type ?? "match",
                        data: raw.data,
                    };
                    console.info("[Socket] Evento procesado:", liveEvent.event, "— match_id:", liveEvent.data.match_id);
                    setLatestEvent(liveEvent);
                } else {
                    console.warn("[Socket] Mensaje sin estructura esperada (falta event o data):", raw);
                }
            } catch (e) {
                console.warn("[Socket] Mensaje no parseable:", event.data, e);
            }
        };

        ws.onerror = (err) => {
            console.error("[Socket] Error en WebSocket:", err);
            setIsConnected(false);
        };

        ws.onclose = (ev) => {
            console.warn(
                `[Socket] Conexión cerrada — code: ${ev.code}, reason: "${ev.reason || "(sin razón)"}", wasClean: ${ev.wasClean}`
            );
            setIsConnected(false);

            // Reconectar automáticamente en 5 s si el cierre no fue intencional
            if (ev.code !== 1000) {
                console.info("[Socket] Reconectando en 5 s... (code ≠ 1000)");
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
