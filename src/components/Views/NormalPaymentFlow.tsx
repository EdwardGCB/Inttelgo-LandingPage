import ReCAPTCHA from "react-google-recaptcha";
import { trackEvent, trackFormInteraction } from "@/lib/analytics";
import {
  formatCurrency,
  PSE_PAY_BILL_DIALOG,
  PSE_PAY_BILL_FAIL_EXCEEDED_LIMIT,
  PSE_PAY_BILL_FAIL_SERVICE_NOT_CONFIGURED,
  PSE_PAY_BILL_MAINTENANCE_TOAST,
  userTypes,
  type aditionalPaymentType,
  type CuentaType,
  type PsePayBillResponse,
  type PseServiceFormValues,
  type selectBankOption,
  type selectTypeOption,
} from "@/lib/pse";
import { MessageToast } from "@/lib/messageToast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "../ui/card";
import { PageHeader } from "../PageHeader";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { AlertCircle, AlertTriangle, CreditCard, Hash, Info, Loader2, Lock, Smile, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { PaymentAccordion, type PaymentAccordionItem } from "../PaymentAccordion";
import { TableCalculate } from "../TableCalculate";
import PSEService from "@/services/PSEService";
import ClientService from "@/services/ClientService";
import { zodResolver } from "@hookform/resolvers/zod";
import { PseServiceSchema } from "@/utils/Pse.schema";

interface NormalPaymentFlowProps {
  handleSelectPaymentForDiscount: (payment: Record<string, unknown>) => void;
  handleDiscountDialogOpen: (open: boolean) => void;
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "";

/** Evita doble toast en React StrictMode al fallar la carga de bancos. */
let pseBanksLoadErrorToastShown = false;

function NormalPaymentFlow({ handleSelectPaymentForDiscount, handleDiscountDialogOpen }: NormalPaymentFlowProps) {
  const [queryMade, setQueryMade] = useState(false);
  // Arrays completos de la consulta (NO se modifican con los checkboxes)
  const [allPayments, setAllPayments] = useState<CuentaType[]>([]);
  const [allAdditionalPayments, setAllAdditionalPayments] = useState<Array<aditionalPaymentType>>([]);
  const [banks, setBanks] = useState<selectBankOption[]>([]);
  const [identificationTypes, setIdentificationTypes] = useState<selectTypeOption[]>([]);
  const [consultLoading, setConsultLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [banksServiceDown, setBanksServiceDown] = useState(false);
  const [payBillErrorDialog, setPayBillErrorDialog] = useState<
    null | "exceeded_limit" | "service_not_configured"
  >(null);
  const mesActual = new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(new Date());
  const form = useForm<PseServiceFormValues>({
    resolver: zodResolver(PseServiceSchema),
    mode: "onChange",
    defaultValues: {
      ticketId: new Date().getTime().toString(),
      userType: "person",
      amount: 0,
      paymentDescription: "",
      identificationType: "",
      identificationNumber: "",
      acceptTerms: false,
      name: "",
      phone: "",
      email: "",
      address: "",
      financialInstitutionCode: "0",
      financialInstitutionName: "",
      idUrlGenerated: null,
      accounts: [],
      additionalPayments: [],
      recaptchaToken: null
    },
  });

  // Observar cambios en los arrays del formulario para recalcular totales
  const watchedAccounts = form.watch("accounts");
  const watchedAdditionalPayments = form.watch("additionalPayments");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [identificationResult, banksResult] = await Promise.allSettled([
          ClientService.getIdentifyTypes(),
          PSEService.getBanks(),
        ]);

        if (
          identificationResult.status === "fulfilled" &&
          identificationResult.value.success
        ) {
          setIdentificationTypes(identificationResult.value.tipos_identificacion);
        }

        if (banksResult.status === "fulfilled" && banksResult.value.success) {
          setBanks(banksResult.value.bancos);
          setBanksServiceDown(false);
        } else {
          setBanks([]);
          setBanksServiceDown(true);
          if (!pseBanksLoadErrorToastShown) {
            pseBanksLoadErrorToastShown = true;
            MessageToast.error({
              title: PSE_PAY_BILL_MAINTENANCE_TOAST.title,
              description: PSE_PAY_BILL_MAINTENANCE_TOAST.description,
            });
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setBanks([]);
        setBanksServiceDown(true);
        if (!pseBanksLoadErrorToastShown) {
          pseBanksLoadErrorToastShown = true;
          MessageToast.error({
            title: PSE_PAY_BILL_MAINTENANCE_TOAST.title,
            description: PSE_PAY_BILL_MAINTENANCE_TOAST.description,
          });
        }
      }
    };

    loadData();
  }, []);

  // Recalcular totales y descripción cuando cambian las selecciones
  useEffect(() => {
    if (!queryMade) return;

    const accountsArray = watchedAccounts || [];
    const additionalPaymentsArray = watchedAdditionalPayments || [];

    const calculateAccountAmount = (acc: any) => {
      let amount = acc.total_amount || 0;

      // Solo aplicar descuento si hay cupones Y NO hay pagos adicionales
      if (acc.cupones && Array.isArray(acc.cupones) && allAdditionalPayments.length === 0) {
        // Aplicar todos los descuentos acumulativos
        acc.cupones.forEach((cupon: any) => {
          const porcentaje = cupon.porcentaje || cupon.valor_descuento || 0;
          if (porcentaje > 0) {
            const descuento = (amount * porcentaje) / 100;
            amount -= descuento;
          }
        });
      }
      return amount;
    };

    // Calcular total de cuentas
    const totalCuentas = accountsArray.reduce((sum, acc) => (sum + calculateAccountAmount(acc)), 0);

    // Calcular total de pagos adicionales
    const totalPagosAdicionales = additionalPaymentsArray.reduce((sum, ap) => sum + (ap.amount || 0), 0);

    const totalAmount = Math.round(totalCuentas + totalPagosAdicionales);

    // Construir descripción
    if (totalAmount > 0) {
      const numCuentas = accountsArray.length;
      const numPagosAdicionales = additionalPaymentsArray.length;
      const año = new Date().getFullYear();
      const descriptions: string[] = [];
      if (numCuentas > 0) {
        descriptions.push(`Pago servicios (${numCuentas})`);
      }
      if (numPagosAdicionales > 0) {
        descriptions.push(`Pagos Adicionales (${numPagosAdicionales})`);
      }
      form.setValue("amount", totalAmount);
      form.setValue("paymentDescription", descriptions.join("+") + " " + mesActual + " " + año);
    } else {
      form.setValue("amount", 0);
      form.setValue("paymentDescription", "");
    }
  }, [watchedAccounts, watchedAdditionalPayments, queryMade, allPayments, allAdditionalPayments, form]);

  // Funciones auxiliares
  const setPSEToken = (token: string | null) => {
    if (!token) return;

    const cookieParts = [
      `pse_token=${encodeURIComponent(token)}`,
      "path=/",
      "SameSite=Strict",
    ];

    if (window.location.protocol === "https:") {
      cookieParts.push("Secure");
    }

    document.cookie = cookieParts.join("; ");
  };

  const calculateInstallmentValue = (cobro: any) => {
    if (cobro.cuotas <= 0) return 0;
    return (cobro.valor_total || 0) / cobro.cuotas;
  };

  // Construir descripción detallada del pago adicional incluyendo detalles de factura
  const buildAdditionalPaymentDescription = (cobro: aditionalPaymentType) => {
    const numeroCuota = (cobro?.ultimo_pago?.numero_cuota || 0) + 1;
    const totalCuotas = cobro.cuotas;
    const observacion = cobro.observacion || "Pago adicional";

    // Construir descripción de los detalles de factura
    const detallesDescripcion = cobro.detalles_factura_cobro && cobro.detalles_factura_cobro.length > 0
      ? cobro.detalles_factura_cobro.map((detalle) => {
        return `${detalle.cantidad}x ${detalle.descripcion} (${formatCurrency(detalle.valor)})`;
      }).join(", ")
      : "";

    const descriptionParts = [
      observacion, `Cuota ${numeroCuota} de ${totalCuotas} `, detallesDescripcion].filter(Boolean);

    return descriptionParts.join(" - ");
  };

  const pseActionsBlocked = banksServiceDown;

  // Función principal de consulta
  const onConsult = async () => {
    if (pseActionsBlocked) {
      return;
    }

    trackEvent("pse_consult_start", {
      event_category: "pse",
      event_label: "service_consultation",
    });

    try {
      setConsultLoading(true);
      setQueryMade(false);
      setAllPayments([]);
      setAllAdditionalPayments([]);
      form.setValue("accounts", []);
      form.setValue("additionalPayments", []);

      // Paso 1: Consultar identificación
      const response = await ClientService.consultByIdentification(form.getValues("identificationNumber"));

      if (!response.success) {
        console.error("Error consulting service:", response.data?.message);
        return;
      }

      // Extraer y guardar token
      const token = response?.token ?? response?.data?.token ?? response?.result?.token ?? null;
      setPSEToken(token);

      // Extraer datos del cliente y cuentas
      const cliente = response.cliente ?? response.data?.cliente;

      // Paso 2: Consultar cuenta
      const responseCorte = await PSEService.consultCutAccountByClient(cliente.id);

      if (!responseCorte.success) {
        console.error("Error consulting account:", responseCorte.data?.message);
        return;
      }

      const cuentas = (responseCorte.cuentas || []) as Record<string, unknown>[];
      // Establecer datos del cliente en el formulario
      form.setValue("name", (cliente?.nombre1 || "") + " " + (cliente?.nombre2 || "") + " " + (cliente?.apellido1 || "") + " " + (cliente?.apellido2 || ""));
      form.setValue("phone", cliente.telefono1 ?? "");
      form.setValue("email", cliente.correo ?? "");
      form.setValue("address", cliente.direccion ?? "");

      // Paso 3: Consultar pagos adicionales (solo si hay cliente)
      let cobrosAdicionales: any[] = [];
      const responsePagoAdicional = await PSEService.consultAdditionalPayments(cliente.id, 1);
      if (responsePagoAdicional.success) {
        cobrosAdicionales = responsePagoAdicional.cobros ?? responsePagoAdicional.data?.cobros ?? [];
      }

      setAllPayments(cuentas as CuentaType[]);
      setAllAdditionalPayments(cobrosAdicionales);

      // Track successful service consultation
      if (form.getValues("amount") > 0) {
        trackEvent("pse_consult_success", {
          event_category: "pse",
          event_label: "service_consultation",
          value: form.getValues("amount"),
          number_of_accounts: cuentas.length,
        });
      }

      setQueryMade(true);
    } catch (error) {
      console.error("Error consulting service:", error);
    } finally {
      setConsultLoading(false);
    }
  };

  const handleAccountCheckboxChange = (payment: any, checked: boolean) => {
    const currentAccounts = form.getValues("accounts") || [];
    const idCuenta = payment?.id || 0;

    const numeroCuenta = payment?.nro_cuenta || "";
    const descripcion_servicio = (payment.plan ? payment.plan + "MB " : "") + (payment?.tipo_plan?.descripcion || "") + (payment?.tipo_servicio?.descripcion || "");


    const desc = [numeroCuenta, descripcion_servicio, "Correspondientes al mes de " + mesActual]
      .filter(Boolean)
      .join(" ");

    if (checked) {
      const cupones = (allAdditionalPayments.length > 0)
        ? undefined
        : payment?.cupones as Array<{ id: number; codigo: string; porcentaje?: number }> | undefined;

      form.setValue("accounts", [
        ...currentAccounts,
        { id: idCuenta, internet_amount: payment?.valor_internet || 0, telephony_amount: payment?.valor_telefonia || 0, tv_amount: payment?.valor_television || 0, total_amount: payment?.valor_total || 0, cupones: cupones, description: desc }
      ]);

    } else {
      // Eliminar cuenta
      form.setValue(
        "accounts",
        currentAccounts.filter((acc) => acc.id !== idCuenta)
      );
    }
    // Validar después de cambiar
    form.trigger(["accounts", "additionalPayments"]);
  };

  // Manejar cambio de checkbox para pagos adicionales
  const handleAdditionalPaymentCheckboxChange = (cobro: aditionalPaymentType, checked: boolean) => {
    const currentAdditionalPayments = form.getValues("additionalPayments") || [];

    if (checked) {
      // Agregar pago adicional
      const valorCuota = Math.round(calculateInstallmentValue(cobro));
      form.setValue("additionalPayments", [
        ...currentAdditionalPayments,
        { id: cobro.id, amount: valorCuota, cuota: (cobro?.ultimo_pago?.numero_cuota || 0) + 1, description: buildAdditionalPaymentDescription(cobro) }
      ]);
    } else {
      // Eliminar pago adicional
      form.setValue(
        "additionalPayments",
        currentAdditionalPayments.filter((ap) => ap.id !== cobro.id)
      );
    }
    // Validar después de cambiar
    form.trigger(["accounts", "additionalPayments"]);
  };

  const onSubmit = async (values: PseServiceFormValues) => {
    if (pseActionsBlocked) {
      return;
    }

    setSubmitLoading(true);
    trackFormInteraction("pse_payment_form", "start");

    try {
      const data = (await PSEService.payBill(
        JSON.stringify(values)
      )) as PsePayBillResponse;

      const returnCode = data.returnCode;
      const pseURL = typeof data.pseURL === "string" ? data.pseURL.trim() : "";
      const apiMessage = data.mensaje ?? data.message;

      const hasValidRedirect = returnCode === "SUCCESS" && pseURL.length > 0;

      if (hasValidRedirect) {
        trackFormInteraction("pse_payment_form", "submit");
        trackEvent("pse_payment_initiated", {
          event_category: "pse",
          event_label: "payment_initiation",
          value: values.amount,
          currency: "COP",
        });
        window.location.href = pseURL;
        return;
      }

      if (returnCode === "SUCCESS" && !pseURL) {
        MessageToast.error({
          title: PSE_PAY_BILL_MAINTENANCE_TOAST.title,
          description: PSE_PAY_BILL_MAINTENANCE_TOAST.description,
        });
        trackFormInteraction(
          "pse_payment_form",
          "error",
          "SUCCESS sin pseURL"
        );
        console.error("Error generating payment link:", data);
        return;
      }

      if (returnCode === PSE_PAY_BILL_FAIL_EXCEEDED_LIMIT) {
        setPayBillErrorDialog("exceeded_limit");
        trackFormInteraction(
          "pse_payment_form",
          "error",
          `${returnCode}: ${apiMessage ?? ""}`
        );
        console.error("Error generating payment link:", data);
        return;
      }

      if (returnCode === PSE_PAY_BILL_FAIL_SERVICE_NOT_CONFIGURED) {
        setPayBillErrorDialog("service_not_configured");
        trackFormInteraction(
          "pse_payment_form",
          "error",
          `${returnCode}: ${apiMessage ?? ""}`
        );
        console.error("Error generating payment link:", data);
        return;
      }

      MessageToast.error({
        title: PSE_PAY_BILL_MAINTENANCE_TOAST.title,
        description: PSE_PAY_BILL_MAINTENANCE_TOAST.description,
      });
      trackFormInteraction(
        "pse_payment_form",
        "error",
        `${returnCode ?? "unknown"}: ${apiMessage ?? ""}`
      );
      console.error("Error generating payment link:", data);
    } catch (error) {
      MessageToast.error({
        title: PSE_PAY_BILL_MAINTENANCE_TOAST.title,
        description: PSE_PAY_BILL_MAINTENANCE_TOAST.description,
      });
      trackFormInteraction("pse_payment_form", "error", "Network error");
      console.error("Error generating payment link:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Calcular total seleccionado de cuentas
  const selectedAccountsTotal = (watchedAccounts || []).reduce((sum, acc) => sum + (acc.total_amount || 0), 0);

  // Calcular total seleccionado de pagos adicionales
  const selectedAdditionalTotal = (watchedAdditionalPayments || []).reduce((sum, ap) => sum + (ap.amount || 0), 0);

  // Crea una función helper para calcular el total con descuentos:
  const calculateTotalWithDiscounts = () => {
    const accountsArray = watchedAccounts || [];

    return accountsArray.reduce((sum, acc) => {
      let amount = acc.total_amount || 0;

      // Solo aplicar descuento si hay cupones Y NO hay pagos adicionales
      if (acc.cupones && Array.isArray(acc.cupones) && allAdditionalPayments.length === 0) {
        acc.cupones.forEach((cupon: any) => {
          const porcentaje = cupon.porcentaje || cupon.valor_descuento || 0;
          if (porcentaje > 0) {
            const descuento = (amount * porcentaje) / 100;
            amount -= descuento;
          }
        });
      }

      return sum + amount;
    }, 0);
  };

  const payDialogCopy =
    payBillErrorDialog === "exceeded_limit"
      ? PSE_PAY_BILL_DIALOG.exceededLimit
      : payBillErrorDialog === "service_not_configured"
        ? PSE_PAY_BILL_DIALOG.serviceNotConfigured
        : null;

  return (
    <>
      <Form {...form}>
        <form
          className="space-y-8 w-full max-w-full overflow-hidden"
          onSubmit={(e) => {
            e.preventDefault();
            form
              .handleSubmit(onSubmit)()
              .catch((err) => console.error("Error en submit:", err));
          }}
        >
          <div className="grid gap-6 sm:grid-cols-2 w-full max-w-full overflow-hidden">
            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center gap-2 text-base font-semibold text-black">
                    <User className="h-4 w-4 text-[#ff6400]" />
                    Tipo de usuario *
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full truncate">
                        <SelectValue placeholder="Selecciona el tipo de usuario" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userTypes.map(({ label, value, icon: Icon }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identificationType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="flex items-center gap-2 text-base font-semibold text-black">
                    <CreditCard className="h-4 w-4 text-[#ff6400]" />
                    Tipo de Identificación *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    disabled={identificationTypes.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full truncate">
                        <SelectValue placeholder="Selecciona el tipo de identificación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {identificationTypes.map((option) => (
                        <SelectItem
                          key={`${option.value}-${option.label}`}
                          value={option.valor_identificacion.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identificationNumber"
              rules={{ required: "Ingresa el número de identificación" }}
              render={({ field }) => (
                <FormItem className="space-y-3 sm:col-span-2">
                  <FormLabel className="flex items-center gap-2 text-base font-semibold text-black">
                    <Hash className="h-4 w-4 text-[#ff6400]" />
                    Número de Identificación *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa tu número"
                      className="h-12 rounded-lg border border-black/10 bg-white px-4 text-sm focus:border-[#ff6400] focus:ring-[#ff6400]/40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            variant="orange"
            type="button"
            onClick={onConsult}
            disabled={consultLoading || pseActionsBlocked}
            className="h-12 w-full text-base font-semibold text-white"
          >
            {consultLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Consultando servicio...
              </>
            ) : (
              "Consultar servicio"
            )}
          </Button>

          {consultLoading && (
            <Card className="border-dashed border-orange-200 bg-orange-50/60 shadow-none w-full overflow-hidden">
              <CardContent className="flex items-center gap-3 py-4 sm:py-6 px-4 sm:px-6">
                <Loader2 className="h-5 w-5 animate-spin text-orange-500 flex-shrink-0" />
                <p className="text-sm font-medium text-orange-700 break-words">
                  Consultando información del servicio. Esto puede tardar unos segundos.
                </p>
              </CardContent>
            </Card>
          )}

          {!consultLoading && queryMade && (
            <>
              {/* Información del Cliente */}
              <Card className="border-[#ff6400]/40 shadow-sm shadow-[#ff6400]/10 w-full overflow-hidden">
                <PageHeader
                  className=""
                  title={
                    <div className="flex flex-row gap-2 items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff6400]/10 flex-shrink-0">
                        <User className="h-6 w-6 text-[#ff6400]" />
                      </div>
                      Información del cliente
                    </div>
                  }
                  subtitle="Verifica y actualiza los datos antes de continuar"
                  titleClassName="text-lg font-semibold text-[#ff6400] break-words"
                  subtitleClassName="text-xs text-muted-foreground break-words"
                />
                <Separator className="mb-4 mt-2 bg-[#ff6400]/30" />
                <CardContent className="space-y-2 overflow-hidden">
                  <div className="grid gap-6 sm:grid-cols-2 w-full max-w-full">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-semibold text-black">Nombre</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly
                              className="h-12 rounded-lg border border-black/10 bg-muted px-4 text-sm text-black"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-semibold text-black">Teléfono</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              readOnly
                              className="h-12 rounded-lg border border-black/10 bg-muted px-4 text-sm text-black"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      rules={{
                        required: "Ingresa el correo del cliente",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                          message: "Ingresa un correo válido",
                        },
                      }}
                      render={({ field }) => (
                        <FormItem className="space-y-2 sm:col-span-2">
                          <FormLabel className="text-sm font-semibold text-black">Correo electrónico</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Ingresa el correo del cliente"
                              className="h-12 rounded-lg border border-black/10 bg-white px-4 text-sm focus:border-[#ff6400] focus:ring-[#ff6400]/40"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      rules={{ required: "Ingresa la dirección del cliente" }}
                      render={({ field }) => (
                        <FormItem className="space-y-2 sm:col-span-2">
                          <FormLabel className="text-sm font-semibold text-black">Dirección</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ingresa la dirección del cliente"
                              className="h-12 rounded-lg border border-black/10 bg-white px-4 text-sm focus:border-[#ff6400] focus:ring-[#ff6400]/40"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {allPayments.length > 0 || allAdditionalPayments.length > 0 ? (
                <>
                  {/* Pagos Adicionales */}
                  {allAdditionalPayments.length > 0 && (
                    <PaymentAccordion
                      title="Pagos Adicionales"
                      subtitle=""
                      totalAmount={selectedAdditionalTotal}
                      formatCurrency={formatCurrency}
                      enableSelection={true}
                      selectedItems={new Set((watchedAdditionalPayments || []).map((ap) => ap.id))}
                      onSelectionChange={(itemId, checked) => {
                        const cobro = allAdditionalPayments.find((c) => c.id === itemId);
                        if (cobro) {
                          handleAdditionalPaymentCheckboxChange(cobro, checked);
                        }
                      }}
                      items={allAdditionalPayments.map((cobro): PaymentAccordionItem<typeof cobro> => {
                        const hasCuentas = allPayments.length > 0;
                        const useValorFinal = !hasCuentas;
                        const valorCuota = calculateInstallmentValue(cobro);

                        return {
                          id: cobro.id,
                          data: cobro,
                          getSummary: () => ({
                            title: cobro.observacion || `Pago adicional #${cobro.id}`,
                            subtitle: `ID: ${cobro.id} | Fecha: ${new Date(
                              cobro.fecha_realizacion
                            ).toLocaleDateString("es-CO", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}`,
                            primaryValue: formatCurrency(valorCuota),
                            primaryLabel: "Valor Cuota",
                            secondaryValue: cobro.cuotas.toString(),
                            secondaryLabel: "Cuotas",
                          }),
                          getDetails: () => {
                            const numeroCuotaActual = (cobro?.ultimo_pago?.numero_cuota || 0) + 1;
                            const totalCuotas = cobro.cuotas;
                            const detallesFactura = cobro.detalles_factura_cobro || [];

                            return {
                              leftColumn: [
                                {
                                  label: "Concepto",
                                  value: (
                                    <span className="font-medium">
                                      {cobro.observacion || "Pago adicional"}
                                    </span>
                                  ),
                                },
                                {
                                  label: "Detalle del Pago",
                                  value: (
                                    <span className="font-medium">
                                      Cuota {numeroCuotaActual} de {totalCuotas} - {formatCurrency(Math.round(calculateInstallmentValue(cobro)))}
                                    </span>
                                  ),
                                },
                                ...(detallesFactura.length > 0
                                  ? [
                                    {
                                      label: `Detalles de Factura (${detallesFactura.length})`,
                                      value: (
                                        <div className="space-y-2 mt-2">
                                          {detallesFactura.map((detalle, idx) => (
                                            <div
                                              key={detalle.id_detalle_factura_cobro || idx}
                                              className="p-2 bg-blue-50 rounded border border-blue-200"
                                            >
                                              <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-semibold text-gray-900 break-words">
                                                    {detalle.descripcion}
                                                  </p>
                                                  <p className="text-xs text-gray-600 mt-1">
                                                    Cantidad: {detalle.cantidad} x {formatCurrency(detalle.valor)}
                                                  </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                  <span className="text-sm font-bold text-blue-600">
                                                    {formatCurrency(detalle.valor * detalle.cantidad)}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ),
                                    },
                                  ]
                                  : []),
                                {
                                  label: "Fecha de Realización",
                                  value: new Date(cobro.fecha_realizacion).toLocaleDateString("es-CO", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }),
                                },
                                ...(cobro.ultimo_pago
                                  ? [
                                    {
                                      label: "Último Pago",
                                      value: `Cuota ${cobro.ultimo_pago?.numero_cuota || 0} - ${cobro.ultimo_pago.fecha_pago ? new Date(
                                        cobro.ultimo_pago.fecha_pago
                                      ).toLocaleDateString("es-CO") : "N/A"}`,
                                    },
                                  ]
                                  : []),
                              ],
                              rightColumn: [
                                {
                                  label: "Total del Cobro",
                                  value: formatCurrency(
                                    useValorFinal ? (cobro as any).valor_final || cobro.valor_total : cobro.valor_total
                                  ),
                                },
                                {
                                  label: "Número de Cuotas",
                                  value: `${cobro.cuotas} ${cobro.cuotas === 1 ? "cuota" : "cuotas"}`,
                                },
                                {
                                  label: "Valor por Cuota",
                                  value: formatCurrency(valorCuota),
                                },
                              ],
                            };
                          },
                        };
                      })}
                      headerClassName="bg-gradient-to-b from-blue-500 to-blue-600"
                      borderClassName="border-blue-200"
                      accentColor="blue"
                    />
                  )}

                  {/* Cuentas Pendientes */}
                  {allPayments.length > 0 && (
                    <PaymentAccordion
                      title="Cuentas Pendientes"
                      subtitle="Detalle de los servicios a pagar"
                      totalAmount={selectedAccountsTotal}
                      formatCurrency={formatCurrency}
                      enableSelection={true}
                      selectedItems={new Set(
                        (watchedAccounts || []).map((acc) => {
                          const payment = allPayments.find((p) => {
                            const idCuenta = (p.id as number) || p.id || 0;
                            return idCuenta === acc.id;
                          });
                          const numeroCuenta = payment ? ((payment.nro_cuenta as string) || "") : "";
                          return numeroCuenta || acc.id;
                        })
                      )}
                      onSelectionChange={(itemId, checked) => {
                        const payment = allPayments.find((p, idx) => {
                          const nroCuenta = (p.nro_cuenta as string) || "";
                          return (nroCuenta || idx) === itemId;
                        });
                        if (payment) {
                          handleAccountCheckboxChange(payment, checked);
                        }
                      }}
                      items={allPayments.map((payment, index): PaymentAccordionItem<typeof payment> => {
                        const description = (payment.plan ? payment.plan + "MB" : "") + " " + (payment?.tipo_servicio?.descripcion || "") + " " + (payment?.tipo_plan?.descripcion || "");
                        const nroCuenta = (payment.nro_cuenta as string) || "";
                        const direccion = (payment.direccion as string) || "";

                        const cuponesArray = payment.cupones as Array<unknown> | undefined;
                        const hasCupones: boolean =
                          !!cuponesArray && Array.isArray(cuponesArray) && cuponesArray.length > 0 && allAdditionalPayments.length === 0;

                        return {
                          id: nroCuenta || index,
                          data: payment,
                          getSummary: () => ({
                            title: (
                              <div className="flex items-center gap-2">
                                {hasCupones && (
                                  <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                                )}
                                <span>{description || "Servicio"}</span>
                              </div>
                            ),
                            subtitle: `Cuenta: ${nroCuenta} | ${direccion}`,
                            primaryValue: formatCurrency(payment?.valor_total || 0),
                            primaryLabel: "Valor",
                            hasWarning: hasCupones,
                          }),
                          getDetails: () => {
                            const cupones =
                              (payment.cupones as Array<{
                                id: number;
                                codigo: string;
                                descripcion: string;
                                razon?: string;
                                valor_descuento?: number;
                                tipo_descuento_descripcion: string;
                                fecha_fin?: string;
                              }>) || [];

                            const leftColumnItems = [
                              {
                                label: "Número de Cuenta",
                                value: <span className="font-medium">{nroCuenta}</span>,
                              },
                              {
                                label: "Servicio",
                                value: description || "Sin descripción",
                              },
                              {
                                label: "Dirección",
                                value: direccion,
                              },
                            ];

                            if (cupones.length > 0) {
                              leftColumnItems.push({
                                label: `Descuentos Aplicados (${cupones.length})`,
                                value: (
                                  <div className="space-y-2">
                                    {cupones.map((cupon, idx) => (
                                      <div
                                        key={cupon.id || idx}
                                        className="p-2 bg-orange-50 rounded border border-orange-200 cursor-pointer hover:bg-orange-100 hover:border-orange-300 transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectPaymentForDiscount(payment);
                                          handleDiscountDialogOpen(true);
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSelectPaymentForDiscount(payment);
                                            handleDiscountDialogOpen(true);
                                          }
                                        }}
                                        aria-label="Ver detalles de descuentos"
                                      >
                                        <div className="flex items-start justify-between gap-2">
                                          <Info className="h-4 w-4 text-orange-600" />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-orange-900 break-words">
                                              {cupon.tipo_descuento_descripcion ||
                                                cupon.razon ||
                                                cupon.descripcion}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1 break-all">
                                              Código: {cupon.codigo}
                                            </p>
                                          </div>
                                          {cupon.valor_descuento && (
                                            <div className="flex-shrink-0">
                                              <span className="text-xs font-bold text-orange-600">
                                                {cupon.valor_descuento}%
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ),
                              });
                            }

                            const valorInternet = payment?.valor_internet ?? 0;
                            const valorTelefonia = payment?.valor_telefonia ?? 0;
                            const valorTelevision = payment?.valor_television ?? 0;
                            const valorTotal = payment?.valor_total ?? 0;
                            const tableRows = [
                              ...(valorInternet > 0 ? [{ label: "Valor de Internet", value: formatCurrency(valorInternet) }] : []),
                              ...(valorTelefonia > 0 ? [{ label: "Valor de Telefonía", value: formatCurrency(valorTelefonia) }] : []),
                              ...(valorTelevision > 0 ? [{ label: "Valor de Televisión", value: formatCurrency(valorTelevision) }] : []),
                              { label: "Total", value: formatCurrency(valorTotal) },
                            ];
                            const rightColumnItems = [
                              {
                                label: "Desglose",
                                value: <TableCalculate variant="orange" rows={tableRows} lastRowIsTotal />,
                              },
                            ];

                            return {
                              leftColumn: leftColumnItems,
                              rightColumn: rightColumnItems,
                            };
                          },
                        };
                      })}
                      headerClassName="bg-gradient-to-b from-[#ff9900] to-[#ec5406]"
                      borderClassName="border-orange-200"
                      accentColor="orange"
                      className="mt-4"
                    />
                  )}

                  {/* Campos ocultos para validación */}
                  <FormField
                    control={form.control}
                    name="accounts"
                    render={() => <FormItem className="hidden" />}
                  />
                  <FormField
                    control={form.control}
                    name="additionalPayments"
                    render={() => <FormItem className="hidden" />}
                  />

                  {/* Mensaje de error si no hay cuentas ni pagos adicionales seleccionados */}
                  {queryMade &&
                    (!watchedAccounts || watchedAccounts.length === 0) &&
                    (!watchedAdditionalPayments || watchedAdditionalPayments.length === 0) &&
                    (form.formState.errors.accounts ||
                      form.formState.errors.additionalPayments ||
                      form.formState.isSubmitted) && (
                      <Card className="border-red-200 shadow-lg bg-red-50/50 w-full overflow-hidden p-0">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-red-900 mb-1">
                                Selección requerida
                              </p>
                              <p className="text-sm text-red-700">
                                {form.formState.errors.accounts?.message ||
                                  form.formState.errors.additionalPayments?.message ||
                                  "Debe existir al menos una cuenta o un pago adicional seleccionado para continuar"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  {/* Resumen Total */}
                  {(allPayments.length > 0 || allAdditionalPayments.length > 0) && (
                    <Card className="border-green-200 shadow-lg bg-green-50/50 w-full overflow-hidden p-0">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="w-full sm:w-auto min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 break-words">
                              Resumen de Pago
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              {allPayments.length > 0 && (
                                <>
                                  <p className="break-words">
                                    Servicios de Internet:{" "}
                                    <span className="font-semibold text-gray-900">
                                      {formatCurrency(selectedAccountsTotal)}
                                    </span>
                                  </p>
                                  {/* Mostrar descuentos si existen */}
                                  {allAdditionalPayments.length === 0 && calculateTotalWithDiscounts() < selectedAccountsTotal && (
                                    <p className="break-words text-green-600">
                                      Descuentos aplicados:{" "}
                                      <span className="font-semibold">
                                        -{formatCurrency(selectedAccountsTotal - calculateTotalWithDiscounts())}
                                      </span>
                                    </p>
                                  )}
                                </>
                              )}
                              {allAdditionalPayments.length > 0 && (
                                <p className="break-words">
                                  Pagos Adicionales:{" "}
                                  <span className="font-semibold text-gray-900">
                                    {formatCurrency(selectedAdditionalTotal)}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-left sm:text-right w-full sm:w-auto">
                            <p className="text-sm text-gray-600 mb-1">Total a Pagar</p>
                            <p className="text-2xl sm:text-3xl font-bold text-green-600 break-words">
                              {formatCurrency(calculateTotalWithDiscounts() + selectedAdditionalTotal)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Bank Selection */}
                  <Card className="border-orange-200 shadow-lg w-full overflow-hidden">
                    <CardContent className="space-y-6 p-4 sm:p-6">
                      <FormField
                        control={form.control}
                        name="financialInstitutionCode"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="flex items-center gap-2 text-lg">
                              <CreditCard className="h-5 w-5 text-orange-500" />
                              Seleccione su banco*
                            </FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                const selectedBank = banks.find(
                                  (bank) => bank.financialInstitutionCode.toString() === value
                                );
                                if (selectedBank) {
                                  form.setValue(
                                    "financialInstitutionName",
                                    selectedBank.financialInstitutionName
                                  );
                                }
                              }}
                              value={field.value as string | undefined}
                              disabled={consultLoading || banks.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full truncate">
                                  <SelectValue placeholder="Selecciona el banco" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="w-full truncate">
                                {banks.map((option) => (
                                  <SelectItem
                                    key={`select-bank-${option.financialInstitutionCode}`}
                                    value={option.financialInstitutionCode.toString()}
                                  >
                                    {option.financialInstitutionName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="flex items-center justify-center rounded-2xl bg-[#bfe3c3] px-4 sm:px-6 py-4 text-sm font-semibold text-[#1f4b2c] shadow-sm w-full overflow-hidden">
                  <div className="flex items-center gap-3 flex-wrap justify-center">
                    <span className="text-base break-words text-center">
                      Tus pagos están al día
                    </span>
                    <Smile className="h-6 w-6 text-[#1f4b2c] flex-shrink-0" />
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name="recaptchaToken"
                rules={{
                  validate: (value) => {
                    if (!RECAPTCHA_SITE_KEY) {
                      return "Falta VITE_RECAPTCHA_SITE_KEY en la configuración del sitio";
                    }
                    return value || "Confirma que no eres un robot";
                  },
                }}
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col items-center">
                    <FormControl>
                      <div className="flex justify-center w-full">
                        {RECAPTCHA_SITE_KEY ? (
                          <ReCAPTCHA
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={(token: string | null) => field.onChange(token)}
                            onExpired={() => field.onChange(null)}
                          />
                        ) : (
                          <p className="text-center text-sm text-destructive max-w-md">
                            reCAPTCHA no está configurado. Añade VITE_RECAPTCHA_SITE_KEY al entorno y vuelve a generar el
                            build.
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
            </>
          )}
          <div>

          </div>
          <FormField
            control={form.control}
            name="acceptTerms"
            rules={{ validate: (value) => value || "Debes aceptar los términos" }}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border border-black/40 text-[#ff6400] focus:ring-[#ff6400]"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                  <FormLabel className="text-sm font-medium text-black">
                    Acepto los términos y condiciones
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {(allPayments.length > 0 || allAdditionalPayments.length > 0) && (
            <>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 w-full overflow-hidden">
                <p className="text-center text-sm text-blue-900 break-words">
                  <span className="font-semibold">Importante:</span> Serás redirigido al portal de tu
                  banco para completar el pago de forma segura
                </p>
              </div>
              <Button
                variant="orange"
                type="submit"
                className="h-12 w-full text-base font-semibold text-white"
                disabled={
                  submitLoading ||
                  consultLoading ||
                  pseActionsBlocked ||
                  !RECAPTCHA_SITE_KEY
                }
              >
                {submitLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generando enlace de pago...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Continuar al pago seguro
                  </>
                )}
              </Button>
            </>
          )}
        </form>
      </Form>

      <Dialog
        open={payBillErrorDialog !== null}
        onOpenChange={(open) => {
          if (!open) setPayBillErrorDialog(null);
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>{payDialogCopy?.title}</DialogTitle>
            <DialogDescription className="text-left text-base text-gray-700">
              {payDialogCopy?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-stretch">
            <Button
              type="button"
              variant="orange"
              className="w-full sm:w-auto"
              onClick={() => setPayBillErrorDialog(null)}
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


export default NormalPaymentFlow