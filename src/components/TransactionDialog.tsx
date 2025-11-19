import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Clock3,
  XCircle,
  Building2,
  Receipt,
  CreditCard,
  FileText,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Home,
  FileDown,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationStatus = "pending" | "approved" | "rejected";

export type TransactionDialogData = {
  ticket?: string;
  bank?: string;
  trackingCode?: string;
  amount?: number;
  description?: string;
};

type TransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId?: string | null;
  onClose?: () => void;
  newPaymentHref?: string;
  homeHref?: string;
  /**
   * Permite inyectar un estado inicial mientras se realiza la consulta.
   * Útil para pruebas o datos precargados.
   */
  initialData?: {
    status?: VerificationStatus;
    data?: TransactionDialogData | null;
    message?: string | null;
  };
};

type DialogVisualState = VerificationStatus | "loading" | "error";

const VISUAL_CONFIG: Record<
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
    primaryActionLabel: "Reintentar verificación",
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
};

const COMPANY_INFO = {
  nit: "90113229521",
  name: "Inttelgo SAS",
};

const DEFAULT_MESSAGES: Record<VerificationStatus, string> = {
  approved:
    "Tu pago se realizó correctamente y ha sido procesado exitosamente.",
  pending:
    "La transacción está siendo procesada por el banco. Por favor espera la confirmación.",
  rejected:
    "La transacción no pudo ser completada. Por favor verifica tus datos e intenta nuevamente.",
};

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const statusMap: Record<string, VerificationStatus> = {
  aprobada: "approved",
  approved: "approved",
  success: "approved",
  exitosa: "approved",
  pendiente: "pending",
  pending: "pending",
  procesando: "pending",
  rechazada: "rejected",
  rejected: "rejected",
  fallida: "rejected",
  failed: "rejected",
  error: "rejected",
};

const decodeTransaction = (value: string) => {
  try {
    return atob(value);
  } catch {
    return value;
  }
};

const extractToken = () =>
  document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("pse_token="))
    ?.split("=")[1];

export function TransactionDialog({
  open,
  onOpenChange,
  transactionId,
  onClose,
  newPaymentHref = "/pse",
  homeHref = "/",
  initialData,
}: TransactionDialogProps) {
  const [status, setStatus] = useState<VerificationStatus>(
    initialData?.status ?? "pending"
  );
  const [message, setMessage] = useState<string | null>(
    initialData?.message ?? null
  );
  const [data, setData] = useState<TransactionDialogData | null>(
    initialData?.data ?? null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!transactionId) {
      setError("No se recibió un identificador de transacción válido.");
      setStatus("rejected");
      setLoading(false);
      return;
    }

    if (!apiUrl) {
      console.warn("VITE_API_URL is not defined");
      setError(
        "No se encontró la configuración del servicio. Intenta nuevamente más tarde."
      );
      setStatus("rejected");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const decodedId = decodeTransaction(transactionId);

    const fetchTransaction = async () => {
      setLoading(true);
      setError(null);
      setStatus("pending");
      setMessage(null);
      setData(null);

      try {
        const token = extractToken();
        const response = await axios.get(
          `${apiUrl}/pse/verifyTransaction/${decodedId}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            signal: controller.signal,
          }
        );

        const responseData = response.data;

        const rawStatus = String(
          responseData?.status ??
            responseData?.transactionInfo?.estado ??
            responseData?.estado ??
            responseData?.returnCode ??
            ""
        ).toLowerCase();

        const normalizedStatus =
          statusMap[rawStatus] ??
          (responseData?.success || responseData?.returnCode === "SUCCESS"
            ? "approved"
            : "pending");

        const info =
          responseData?.transactionInfo ??
          responseData?.transaction ??
          responseData?.data ??
          responseData?.detalle ??
          {};

        const parseAmount = (value: unknown) => {
          const numeric = Number(
            typeof value === "string" ? value.replace(/[^0-9.-]+/g, "") : value
          );
          return Number.isFinite(numeric) ? numeric : 0;
        };

        const normalizedData: TransactionDialogData = {
          ticket:
            (info?.ticket as string) ??
            (info?.ticketId as string) ??
            (responseData?.ticket as string) ??
            decodedId,
          bank:
            (info?.institutionName as string) ??
            (info?.banco as string) ??
            (info?.financialInstitution as string) ??
            (responseData?.institutionName as string) ??
            "—",
          trackingCode:
            (info?.trazabilityCode as string) ??
            (info?.codigoSeguimiento as string) ??
            (info?.reference as string) ??
            (info?.referencia as string) ??
            "—",
          amount: parseAmount(
            info?.transactionValue ??
              info?.valor ??
              info?.valor_pago ??
              info?.valorTotal ??
              responseData?.amount
          ),
          description:
            (info?.paymentDescription as string) ??
            (info?.descripcion as string) ??
            (info?.detalle as string) ??
            (responseData?.description as string) ??
            "—",
        };

        setStatus(normalizedStatus);
        setData(normalizedData);
        setMessage(
          responseData?.message ??
            responseData?.observacion ??
            (normalizedStatus === "approved"
              ? "Tu pago se realizó correctamente."
              : null)
        );
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        if (axios.isAxiosError(err) && err.response?.status === 403) {
          console.warn(
            "Verificación detenida: token inválido o expirado, se requiere regenerar.",
            err
          );
          setError(
            "El token de consulta expiró. Vuelve a generar el token antes de verificar el comprobante."
          );
          setStatus("pending");
          setMessage(null);
          setData(
            (current) =>
              current ?? {
                ticket: decodedId,
                bank: "—",
                trackingCode: "—",
                amount: 0,
                description: "Sin información adicional",
              }
          );
        } else {
          console.error("Error verifying transaction:", err);
          setStatus("rejected");
          setData({
            ticket: decodedId,
            bank: "—",
            trackingCode: "—",
            amount: 0,
            description: "Sin información adicional",
          });
          setMessage(
            "No pudimos verificar el estado de la transacción. Intenta de nuevo."
          );
          setError("Se produjo un error al consultar la transacción.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTransaction();

    return () => {
      controller.abort();
    };
  }, [apiUrl, open, transactionId, retryKey]);

  useEffect(() => {
    if (!open) {
      setLoading(false);
    }
  }, [open]);

  const visualState: DialogVisualState = loading
    ? "loading"
    : error
    ? "error"
    : status;

  const config = useMemo(() => VISUAL_CONFIG[visualState], [visualState]);
  const Icon = config.icon;

  const resolvedMessage =
    visualState === "loading"
      ? "Estamos consultando el estado de tu pago. Esto puede tomar unos segundos."
      : visualState === "error"
      ? error ?? "No pudimos verificar el comprobante. Intenta nuevamente."
      : message || DEFAULT_MESSAGES[status];

  const ticket = data?.ticket ?? "—";
  const bank = data?.bank ?? "—";
  const trackingCode = data?.trackingCode ?? "—";
  const description = data?.description ?? "—";

  const InfoItem = ({
    icon: ItemIcon,
    label,
    value,
    highlight,
  }: {
    icon: typeof Building2;
    label: string;
    value: string | number;
    highlight?: boolean;
  }) => (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/50 p-4 transition-colors hover:bg-gray-100/50">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
        <ItemIcon className="h-4 w-4 text-gray-600" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <p
          className={cn(
            "break-words text-sm font-semibold",
            highlight ? "text-orange-600" : "text-gray-900"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );

  const handleRetry = () => {
    if (!transactionId || loading) {
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);
    setRetryKey((current) => current + 1);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) {
          onClose?.();
        }
      }}
    >
      <DialogContent
        className="h-[90vh] w-80 sm:w-3xl overflow-hidden p-0"
        showCloseButton={!loading}
      >
        {/* Header con degradado */}
        <div
          className={cn(
            "relative overflow-hidden bg-gradient-to-br px-8 py-8 text-white",
            config.headerClass
          )}
        >
          {/* Patrón decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-xl backdrop-blur-sm">
              <Icon
                className={cn(
                  "h-10 w-10 text-white drop-shadow-lg",
                  config.iconClassName
                )}
              />
            </div>
            <DialogTitle className="mb-2 text-center text-3xl font-bold text-white">
              Comprobante de Pago
            </DialogTitle>
            <div
              className={cn(
                "mx-auto flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold shadow-lg",
                config.badgeClass
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  config.statusColor,
                  config.iconClassName
                )}
              />
              {config.title}
            </div>
          </div>
        </div>

        {/* Contenido principal con scroll */}
        <div className="max-h-[calc(95vh-280px)] space-y-6 overflow-y-auto px-8 py-6">
          {/* Información de la empresa */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-gray-600" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                  Datos de la Empresa
                </h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">NIT</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {COMPANY_INFO.nit}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500">
                    Razón Social
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {COMPANY_INFO.name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado de la transacción destacado */}
          <Card className={cn("border-2 shadow-md", config.cardClass)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-600">
                    Estado de la Transacción
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-bold uppercase",
                      config.statusColor
                    )}
                  >
                    {config.title}
                  </p>
                </div>
                <Icon
                  className={cn(
                    "h-12 w-12",
                    config.statusColor,
                    config.iconClassName
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Detalles de la transacción */}
          <div className="space-y-3">
            <div className="mb-4 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-gray-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">
                Detalles de la Transacción
              </h3>
            </div>

            {loading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-lg border border-gray-200 bg-gray-100/70"
                  />
                ))}
                <div className="h-24 animate-pulse rounded-lg border border-gray-200 bg-gray-100/70 sm:col-span-2" />
              </div>
            ) : (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoItem icon={Receipt} label="Ticket" value={ticket} />
                  <InfoItem
                    icon={FileText}
                    label="Código de Seguimiento"
                    value={trackingCode}
                  />
                  <InfoItem icon={CreditCard} label="Banco" value={bank} />
                  <InfoItem
                    icon={DollarSign}
                    label="Valor de Pago"
                    value={formatCurrency(data?.amount)}
                    highlight
                  />
                </div>

                <InfoItem
                  icon={FileText}
                  label="Descripción del Pago"
                  value={description}
                />
              </>
            )}
          </div>

          {/* Mensaje de estado */}
          {(resolvedMessage || error) && (
            <Alert className={cn("border-2 shadow-sm", config.alertClass)}>
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-sm font-medium leading-relaxed">
                {resolvedMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Footer con acciones */}
        <DialogFooter className="flex-col gap-4 border-t border-gray-200 bg-gray-50/80 px-8 py-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          {visualState === "approved" && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button asChild variant="outline" className="gap-2">
                <Link to={homeHref}>
                  <FileDown className="h-4 w-4" />
                  Ver Comprobante
                </Link>
              </Button>
              <Button
                variant="orange"
                className="gap-2"
                onClick={() => window.location.assign(newPaymentHref)}
              >
                <ArrowRight className="h-4 w-4" />
                Realizar otro pago
              </Button>
            </div>
          )}

          {visualState === "pending" && !loading && (
            <Button asChild variant="orange" className="gap-2">
              <Link to={homeHref}>
                <Home className="h-4 w-4" />
                Volver al inicio
              </Link>
            </Button>
          )}

          {visualState === "rejected" && (
            <Button
              variant="orange"
              disabled={loading}
              onClick={() => window.location.assign(newPaymentHref)}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              {config.primaryActionLabel}
            </Button>
          )}

          {visualState === "error" && (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
              <Button
                variant="orange"
                onClick={handleRetry}
                disabled={loading}
                className="gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                {config.primaryActionLabel}
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                {config.secondaryActionLabel ?? "Cerrar"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
