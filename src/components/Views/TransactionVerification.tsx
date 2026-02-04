import { COMPANY_INFO, DEFAULT_MESSAGES, formatCurrency, statusMap, VISUAL_CONFIG, type DialogVisualState, type TransactionDialogData, type TransactionDialogProps, type VerificationStatus } from "@/lib/Transaction";
import { cn } from "@/lib/utils";
import axios from "axios";
import { AlertCircle, ArrowRight, Building2, CreditCard, DollarSign, FileDown, FileText, Home, Receipt } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import PSEService from "@/services/PSEService";

function TransactionVerification({
    transactionId = "",
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

    useEffect(() => {

        const controller = new AbortController();

        const fetchTransaction = async () => {
            setLoading(true);
            setError(null);
            setStatus("pending");
            setMessage(null);
            setData(null);

            try {
                const response = await PSEService.consultTransaction(transactionId);

                if (!response.success) {
                    setError(response.message);
                    setStatus("rejected");
                    setLoading(false);
                    return;
                }

                const responseData = response;

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
                        "0",
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
                                ticket: "0",
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
                        ticket: "0",
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
    }, [transactionId]);

    const visualState: DialogVisualState = loading
        ? "loading"
        : error
            ? "error"
            : status;

    const config = useMemo(() => VISUAL_CONFIG[visualState], [visualState]);
    const Icon = config.icon;

    const handleRetry = () => {
        if (!transactionId || loading) {
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);
    };

    const handleGeneratePDF = async () => {
        try {
            const blob = await PSEService.generatePDF(transactionId);
            // Crear URL del Blob
            const blobUrl = window.URL.createObjectURL(blob);

            // Abrir el PDF en una nueva ventana
            window.open(blobUrl, "_blank");

        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    }

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

    return (
        <>
            {/* Header con degradado */}
            <Card
                className={cn(
                    "relative overflow-hidden bg-gradient-to-br px-8 py-8 text-white",
                    config.headerClass
                )}
            >
                <CardContent className="relative">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 shadow-xl backdrop-blur-sm">
                        <Icon
                            className={cn(
                                "h-10 w-10 text-white drop-shadow-lg",
                                config.iconClassName
                            )}
                        />
                    </div>
                    <h2 className="mb-2 text-center text-3xl font-bold text-white">
                        Comprobante de Pago
                    </h2>
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
                </CardContent>
            </Card>

            {/* Contenido principal con scroll */}
            <div className=" space-y-6 px-8 py-6">

                {/* Mensaje de estado */}
                {(resolvedMessage || error) && (
                    <Alert className={cn("border-2 shadow-sm", config.alertClass)}>
                        <AlertCircle className="h-5 w-5" />
                        <AlertDescription className="text-sm font-medium leading-relaxed">
                            {resolvedMessage}
                        </AlertDescription>
                    </Alert>
                )}

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
                                    label="(CUS) Código de Seguimiento"
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

                {visualState === "approved" && (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <Button type="button" variant="outline" className="gap-2" onClick={() => handleGeneratePDF()}>
                            <FileDown className="h-4 w-4" />
                            Ver Comprobante
                        </Button>
                        <Button
                            type="button"
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
                    <Button asChild type="button" variant="orange" className="gap-2">
                        <Link to={homeHref}>
                            <Home className="h-4 w-4" />
                            Volver al inicio
                        </Link>
                    </Button>
                )}

                {visualState === "rejected" && (
                    <Button
                        type="button"
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
                            type="button"
                            variant="orange"
                            onClick={handleRetry}
                            disabled={loading}
                            className="gap-2"
                        >
                            {config.primaryActionLabel}
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

export default TransactionVerification;