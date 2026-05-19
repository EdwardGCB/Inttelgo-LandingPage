const TOKEN_KEY = "token";
const CLIENT_ID_KEY = "client_identificacion";

function readCookie(name: string): string | undefined {
    const entry = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(`${name}=`));
    if (!entry) return undefined;
    return decodeURIComponent(entry.substring(name.length + 1));
}

function writeCookie(name: string, value: string) {
    const parts = [
        `${name}=${encodeURIComponent(value)}`,
        "path=/",
        "SameSite=Strict",
    ];
    if (window.location.protocol === "https:") parts.push("Secure");
    document.cookie = parts.join("; ");
}

function removeCookie(name: string) {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Strict`;
}

export function getAuthToken(): string | undefined {
    return readCookie(TOKEN_KEY);
}

export function setAuthToken(token: string) {
    writeCookie(TOKEN_KEY, token);
}

export function getClientIdentification(): string | undefined {
    return readCookie(CLIENT_ID_KEY);
}

export function setClientIdentification(identificacion: string) {
    writeCookie(CLIENT_ID_KEY, identificacion);
}

export function clearAuthCookies() {
    removeCookie(TOKEN_KEY);
    removeCookie(CLIENT_ID_KEY);
}
