import { AlertTriangle, CheckCircle, Clock3, Loader2, XCircle, BanIcon } from "lucide-react";

export type VerificationStatus = "pending" | "approved" | "rejected" | "failed";

export type TransactionDialogData = {
    ticket?: string;
    bank?: string;
    trackingCode?: string;
    amount?: number;
    description?: string;
};

export type TransactionDialogProps = {
    transactionId?: string;
    newPaymentHref?: string;
    homeHref?: string;
    initialData?: {
        status?: VerificationStatus;
        data?: TransactionDialogData | null;
        message?: string | null;
    };
};

export type DialogVisualState = VerificationStatus | "loading" | "error";

export const VISUAL_CONFIG: Record<
    DialogVisualState,
    {
        icon: typeof CheckCircle;
        title: string;
        headerClass: string;
        statusColor: string;
        badgeClass: string;
        cardClass: string;
        primaryActionLabel: string;
        secondaryActionLabel?: string;
        alertClass: string;
        iconClassName?: string;
    }
> = {
    loading: {
        icon: Loader2,
        title: "Consultando",
        headerClass: "from-blue-500 to-blue-600",
        statusColor: "text-blue-100",
        badgeClass: "bg-white/20 text-white border-white/30",
        cardClass: "border-blue-200/70 bg-blue-50/40",
        primaryActionLabel: "Consultando",
        alertClass: "border-blue-200 bg-blue-50",
        iconClassName: "animate-spin",
    },
    error: {
        icon: AlertTriangle,
        title: "Error de verificación",
        headerClass: "from-red-500 to-red-600",
        statusColor: "text-red-600",
        badgeClass: "bg-red-100 text-red-800 border-red-200",
        cardClass: "border-red-200 bg-red-50/60",
        primaryActionLabel: "Reintentar",
        secondaryActionLabel: "Cerrar",
        alertClass: "border-red-200 bg-red-50",
    },
    approved: {
        icon: CheckCircle,
        title: "Aprobada",
        headerClass: "from-emerald-500 to-emerald-600",
        statusColor: "text-emerald-600",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
        cardClass: "border-emerald-200 bg-emerald-50/50",
        primaryActionLabel: "Verificar estado",
        secondaryActionLabel: "Realizar otro pago",
        alertClass: "border-emerald-200 bg-emerald-50",
    },
    pending: {
        icon: Clock3,
        title: "Pendiente",
        headerClass: "from-amber-500 to-amber-600",
        statusColor: "text-amber-600",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
        cardClass: "border-amber-200 bg-amber-50/50",
        primaryActionLabel: "Verificar estado",
        secondaryActionLabel: "Volver al inicio",
        alertClass: "border-amber-200 bg-amber-50",
    },
    rejected: {
        icon: XCircle,
        title: "Rechazada",
        headerClass: "from-rose-500 to-rose-600",
        statusColor: "text-rose-600",
        badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
        cardClass: "border-rose-200 bg-rose-50/50",
        primaryActionLabel: "Realizar otro pago",
        alertClass: "border-rose-200 bg-rose-50",
    },
    failed: {
        icon: BanIcon,
        title: "Fallida",
        headerClass: "from-red-600 to-red-700",
        statusColor: "text-red-600",
        badgeClass: "bg-red-100 text-red-800 border-red-200",
        cardClass: "border-red-200 bg-red-50/50",
        primaryActionLabel: "Realizar otro pago",
        alertClass: "border-red-200 bg-red-50",
    },
};

export const COMPANY_INFO = {
    nit: "90113229521",
    name: "Inttelgo SAS",
};

export const DEFAULT_MESSAGES: Record<VerificationStatus, string> = {
    approved:
        "Tu pago se realizó correctamente y ha sido procesado exitosamente.",
    pending:
        "La transacción está siendo procesada por el banco. Por favor espera la confirmación.",
    rejected:
        "La transacción fue rechazada. Por favor verifica tus datos e intenta nuevamente.",
    failed:
        "La transacción falló durante el procesamiento. Por favor intenta realizar el pago nuevamente.",
};

export const formatCurrency = (value?: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value ?? 0);

export const statusMap: Record<string, VerificationStatus> = {
    aprobada: "approved",
    approved: "approved",
    success: "approved",
    exitosa: "approved",
    pendiente: "pending",
    pending: "pending",
    procesando: "pending",
    rechazada: "rejected",
    rejected: "rejected",
    error: "rejected",
    fallida: "failed",
    failed: "failed",
};

export const decodeTransaction = (value: string) => {
    try {
        return atob(value);
    } catch {
        return value;
    }
};