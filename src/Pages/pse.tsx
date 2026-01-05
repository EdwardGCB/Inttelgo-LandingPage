import Menu from "@/Layouts/Menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SEO from "@/components/SEO";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Building2,
  CreditCard,
  Hash,
  Info,
  Loader2,
  Lock,
  Smile,
  User,
} from "lucide-react";
import { TransactionDialog } from "@/components/TransactionDialog";
import axios from "axios";
import {
  trackEvent,
  trackFormInteraction,
  trackConversion,
} from "@/lib/analytics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const userTypes = [
  {
    label: "Persona Natural",
    value: "person",
    icon: User,
  },
  {
    label: "Persona Jurídica",
    value: "company",
    icon: Building2,
  },
];

type PseFormValues = {
  ticketId: string;
  amount: number;
  paymentDescription: string;
  userType: string;
  identificationType: string;
  identificationNumber: string;
  acceptTerms: boolean;
  name: string;
  phone: string;
  email: string;
  address: string;
  financialInstitutionCode: string;
  financialInstitutionName: string;
};

type selectTypeOption = {
  value: string;
  label: string;
  valor_identificacion: string;
};

type selectBankOption = {
  financialInstitutionCode: string;
  financialInstitutionName: string;
};

export default function Pse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const transactionParam = searchParams.get("transaction");

  const [queryMade, setQueryMade] = useState(false);
  const [payments, setPayments] = useState<Record<string, unknown>[]>([]);
  const [banks, setBanks] = useState<selectBankOption[]>([]);
  const [identificationTypes, setIdentificationTypes] = useState<
    selectTypeOption[]
  >([]);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [selectedPaymentForDiscount, setSelectedPaymentForDiscount] =
    useState<Record<string, unknown> | null>(null);
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [identTypesLoading, setIdentTypesLoading] = useState(false);
  const [consultLoading, setConsultLoading] = useState(false);
  const [banksLoading, setBanksLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [additionalPayments, setAdditionalPayments] = useState<
    Array<{
      id: number;
      fecha_realizacion: string;
      valor_final: number;
      valor_total: number;
      iva: number;
      observacion?: string;
      cuotas: number;
      ultimo_pago?: {
        id: number;
        fecha_pago: string;
        numero_cuota: number;
      };
    }>
  >([]);

  const idTypePlaceholder = identTypesLoading
    ? "Cargando tipos..."
    : "Selecciona el tipo de identificación";

  const bankPlaceholder = banksLoading
    ? "Cargando bancos..."
    : "Selecciona el banco";

  const form = useForm<PseFormValues>({
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
    },
  });

  useEffect(() => {
    if (!apiUrl) {
      console.warn("VITE_API_URL is not defined");
      return;
    }

    const fetchIdentificationTypes = async () => {
      try {
        setIdentTypesLoading(true);
        const response = await axios.get(`${apiUrl}/tipoidentificacion/select`);
        if (response.data.success) {
          setIdentificationTypes(response.data.tipos_identificacion);
        }
      } catch (error) {
        console.error("Error fetching PSE identification types:", error);
      } finally {
        setIdentTypesLoading(false);
      }
    };

    fetchIdentificationTypes();
  }, [apiUrl]);

  useEffect(() => {
    if (!transactionParam) {
      setTransactionId(null);
      setVerificationDialogOpen(false);
      return;
    }

    setTransactionId(transactionParam);
    setVerificationDialogOpen(true);
  }, [transactionParam]);

  useEffect(() => {
    if (!apiUrl) {
      console.warn("VITE_API_URL is not defined");
      return;
    }

    // Consultar bancos si hay cuentas pendientes O pagos adicionales
    if (payments.length === 0 && additionalPayments.length === 0) {
      setBanks([]);
      setBanksLoading(false);
      return;
    }

    const fetchBanks = async () => {
      try {
        setBanksLoading(true);
        const token = document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith("pse_token="))
          ?.split("=")[1];
        const response = await axios.get(`${apiUrl}/pse/banco`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (response.data.success) {
          setBanks(response.data.bancos);
        } else {
          setBanks([]);
        }
      } catch (error) {
        console.error("Error fetching PSE banks:", error);
        setBanks([]);
      } finally {
        setBanksLoading(false);
      }
    };

    fetchBanks();
  }, [apiUrl, payments, additionalPayments]);

  const onConsult = async () => {
    if (!apiUrl) {
      console.warn("VITE_API_URL is not defined");
      return;
    }

    trackEvent("pse_consult_start", {
      event_category: "pse",
      event_label: "service_consultation",
    });

    try {
      setConsultLoading(true);
      setQueryMade(false);
      setPayments([]);
      setBanks([]);
      setBanksLoading(false);

      const referencia = form.getValues("identificationNumber");
      const response = await axios.post(
        `${apiUrl}/cliente/generate_token/`,
        JSON.stringify({ referencia }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        const token =
          response.data?.token ??
          response.data?.data?.token ??
          response.data?.result?.token ??
          null;

        if (token) {
          const cookieParts = [
            `pse_token=${encodeURIComponent(token)}`,
            "path=/",
            "SameSite=Strict",
          ];

          if (window.location.protocol === "https:") {
            cookieParts.push("Secure");
          }

          document.cookie = cookieParts.join("; ");
        }

        const responseCorte = await axios.get(`${apiUrl}/pse/cuenta/corte`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (responseCorte.data.success) {
          if (
            responseCorte.data.cuentas &&
            responseCorte.data.cuentas.length > 0
          ) {
            const cliente = responseCorte.data.cliente;
            if (cliente) {
              form.setValue("name", cliente.nombre ?? "");
              form.setValue("phone", cliente.telefono ?? "");
              form.setValue("email", cliente.correo ?? "");
              form.setValue("address", cliente.direccion ?? "");

              const responsePagoAdicional = await axios.get(
                `${apiUrl}/factura-cobro/client/status/${cliente.id}`,
                {
                  params: { status: 2 },
                  headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                }
              );
              if (responsePagoAdicional.data.success) {
                setAdditionalPayments(responsePagoAdicional.data.cobros || []);
              }
            }

            const cuentas = responseCorte.data.cuentas as Record<
              string,
              unknown
            >[];
            setPayments(cuentas);

            // Calcular total de cuentas
            const totalCuentas = cuentas.reduce((sum, payment) => {
              const plan = payment?.plan as { precio?: number } | undefined;
              const price = typeof plan?.precio === "number" ? plan.precio : 0;
              return sum + price;
            }, 0);

            // Calcular total de pagos adicionales (valor de cuota = valor_final / cuotas)
            const totalPagosAdicionales = Math.round(
              additionalPayments.reduce((sum, cobro) => {
                const valorCuota =
                  cobro.cuotas > 0
                    ? (cobro.valor_final || 0) / cobro.cuotas
                    : 0;
                return sum + valorCuota;
              }, 0)
            );

            // Total general (redondeado a entero)
            const totalAmount = Math.round(
              totalCuentas + totalPagosAdicionales
            );

            // Track successful service consultation
            trackEvent("pse_consult_success", {
              event_category: "pse",
              event_label: "service_consultation",
              value: totalAmount,
              number_of_accounts: cuentas.length,
            });

            const paymentDescription = [
              ...cuentas.map((payment) => {
                const numeroCuenta =
                  (payment?.numero_cuenta as string | undefined) ??
                  (payment?.cuenta as string | undefined) ??
                  "";
                const plan = payment?.plan as
                  | { descripcion?: string }
                  | undefined;
                const descripcionPlan = plan?.descripcion ?? "";
                return [numeroCuenta, descripcionPlan]
                  .filter(Boolean)
                  .join(" - ");
              }),
              ...(additionalPayments.length > 0
                ? [
                    `Pagos Adicionales (${additionalPayments.length} ${
                      additionalPayments.length === 1 ? "cobro" : "cobros"
                    })`,
                  ]
                : []),
            ]
              .filter(Boolean)
              .join(" | ");

            form.setValue("amount", totalAmount);
            form.setValue("paymentDescription", paymentDescription);
            setQueryMade(true);
          } else {
            const cliente = responseCorte.data.cliente;
            let cobrosAdicionales: Array<{
              id: number;
              fecha_realizacion: string;
              valor_final: number;
              valor_total: number;
              iva: number;
              observacion?: string;
              cuotas: number;
              ultimo_pago?: {
                id: number;
                fecha_pago: string;
                numero_cuota: number;
              };
            }> = [];

            if (cliente) {
              form.setValue("name", cliente.nombre ?? "");
              form.setValue("phone", cliente.telefono ?? "");
              form.setValue("email", cliente.correo ?? "");
              form.setValue("address", cliente.direccion ?? "");
              const responsePagoAdicional = await axios.get(
                `${apiUrl}/factura-cobro/client/status/${cliente.id}`,
                {
                  params: { status: 2 },
                  headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                }
              );
              if (responsePagoAdicional.data.success) {
                cobrosAdicionales = responsePagoAdicional.data.cobros || [];
                setAdditionalPayments(cobrosAdicionales);
              }
            }

            setPayments([]);

            // Calcular total solo de pagos adicionales si no hay cuentas (valor de cuota = valor_final / cuotas)
            const totalPagosAdicionales = Math.round(
              cobrosAdicionales.reduce((sum, cobro) => {
                const valorCuota =
                  cobro.cuotas > 0
                    ? (cobro.valor_final || 0) / cobro.cuotas
                    : 0;
                return sum + valorCuota;
              }, 0)
            );

            if (totalPagosAdicionales > 0) {
              form.setValue("amount", totalPagosAdicionales);
              form.setValue(
                "paymentDescription",
                `Pagos Adicionales (${cobrosAdicionales.length} ${
                  cobrosAdicionales.length === 1 ? "cobro" : "cobros"
                })`
              );
            }

            setQueryMade(true);
          }
        } else {
          console.error("Error consulting service:", response.data.message);
        }
      } else {
        console.error("Error consulting service:", response.data.message);
      }
    } catch (error) {
      console.error("Error consulting service:", error);
    } finally {
      setConsultLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
    return formatted;
  };

  const onSubmit = async (values: PseFormValues) => {
    if (!apiUrl) {
      console.warn("VITE_API_URL is not defined");
      return;
    }

    setSubmitLoading(true);
    trackFormInteraction("pse_payment_form", "start");

    const token = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("pse_token="))
      ?.split("=")[1];

    // Recopilar todos los cupones de todas las cuentas
    const cupones = payments.flatMap((payment) => {
      if (payment.cupones && Array.isArray(payment.cupones)) {
        return (
          payment.cupones as Array<{
            id: number;
            codigo: string;
            idCuenta?: number;
          }>
        ).map((cupon) => ({
          id: cupon.id,
          codigo: cupon.codigo,
          idCuenta: cupon.idCuenta || (payment.idCuenta as number),
        }));
      }
      return [];
    });

    // Recopilar IDs de pagos adicionales
    const pagosAdicionalesIds = additionalPayments.map((cobro) => cobro.id);

    // Calcular total de pagos adicionales (redondeado a entero)
    const totalPagosAdicionales = Math.round(
      additionalPayments.reduce((sum, cobro) => {
        const valorCuota =
          cobro.cuotas > 0 ? (cobro.valor_final || 0) / cobro.cuotas : 0;
        return sum + valorCuota;
      }, 0)
    );

    // Asegurar que el amount sea un entero
    const amountEntero = Math.round(values.amount);

    // Actualizar paymentDescription para incluir total de pagos adicionales (entero)
    let updatedPaymentDescription = values.paymentDescription;
    if (totalPagosAdicionales > 0) {
      updatedPaymentDescription = `${values.paymentDescription} +${totalPagosAdicionales}`;
    }

    const payload: PseFormValues & {
      cupones?: Array<{ id: number; codigo: string; idCuenta: number }>;
      pagosAdicionales?: number[];
    } = {
      ...values,
      amount: amountEntero,
      paymentDescription: updatedPaymentDescription,
      ticketId: new Date().getTime().toString(),
      ...(cupones.length > 0 && { cupones }),
      ...(pagosAdicionalesIds.length > 0 && {
        pagosAdicionales: pagosAdicionalesIds,
      }),
    };

    try {
      const response = await axios.post(
        `${apiUrl}/pse/iniciar_transaccion`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      if (response.data.returnCode === "SUCCESS") {
        // Track successful payment initiation
        trackFormInteraction("pse_payment_form", "submit");
        trackEvent("pse_payment_initiated", {
          event_category: "pse",
          event_label: "payment_initiation",
          value: values.amount,
          currency: "COP",
        });
        trackConversion("pse_payment_initiated", values.amount, "COP");

        window.location.href = response.data.pseURL;
      } else {
        trackFormInteraction(
          "pse_payment_form",
          "error",
          response.data.message
        );
        console.error("Error generating payment link:", response.data);
      }
    } catch (error) {
      trackFormInteraction("pse_payment_form", "error", "Network error");
      console.error("Error generating payment link:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setVerificationDialogOpen(open);

    if (!open) {
      setTransactionId(null);
      if (transactionParam) {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete("transaction");
        setSearchParams(nextParams);
      }
    }
  };

  return (
    <>
      <SEO
        title="Pagos en Línea Inttelgo - Paga tu Factura de Internet con PSE | Inttelgo Pagos"
        description="Paga tu factura de internet en línea de forma segura con PSE. Inttelgo pagos en línea, pagos por PSE Inttelgo. Sistema de pagos rápido y seguro para tus facturas de internet, televisión y telefonía."
        keywords="pagos en línea, pagar tu factura de internet en línea, inttelgo pagos en línea, pagos por pse inttelgo, pagar factura inttelgo, pago pse inttelgo, pagos online inttelgo, facturación inttelgo, pagar internet en línea"
        ogTitle="Pagos en Línea Inttelgo - Paga tu Factura con PSE"
        ogDescription="Paga tu factura de internet en línea de forma segura con PSE. Sistema de pagos rápido y seguro para tus facturas de internet, televisión y telefonía."
        ogUrl="https://inttelgo.com/pse"
        canonical="https://inttelgo.com/pse"
      />
      <div className="bg-[#f7f8fb]">
        <Menu
          className={"text-black hover:text-black/80"}
          textColor="text-black hover:text-black/80"
          detailsColor=""
          lineColor="bg-black/50"
        />
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-12 sm:px-6 md:px-10 lg:px-0">
          <Card className="overflow-hidden border-black/10 bg-white shadow-lg shadow-black/5 p-0">
            <div className="bg-gradient-to-b from-[#ff9900] to-[#ec5406] p-6 text-white">
              <h1 className="text-2xl font-semibold">PSE - Pago en línea</h1>
            </div>
            <CardHeader className="items-center gap-2 text-center">
              <div className="flex items-center justify-center gap-6">
                <img
                  src="mano-inttelgo-50px.svg"
                  alt="INTTELGO"
                  className="h-16 w-16 object-contain"
                />
                <span className="text-3xl font-light text-muted-foreground">
                  |
                </span>
                <img
                  src="Logos PSE_180x180.png"
                  alt="PSE"
                  className="h-16 w-16 object-contain"
                />
              </div>
              <CardTitle className="text-2xl font-semibold text-black">
                Ingresa los datos para realizar tu pago
              </CardTitle>
              <CardDescription className="text-base">
                Completa el formulario para consultar tu servicio y pagar de
                forma segura.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <Form {...form}>
                <form
                  className="space-y-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    form
                      .handleSubmit(onSubmit)()
                      .catch((err) => console.error("Error en submit:", err));
                  }}
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="flex items-center gap-2 text-base font-semibold text-black">
                            <User className="h-4 w-4 text-[#ff6400]" />
                            Tipo de usuario *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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
                            disabled={
                              identTypesLoading ||
                              identificationTypes.length === 0
                            }
                          >
                            <FormControl>
                              <SelectTrigger className="w-full truncate">
                                <SelectValue placeholder={idTypePlaceholder} />
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
                          {identTypesLoading && (
                            <p className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Cargando tipos de identificación...
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="identificationNumber"
                      rules={{
                        required: "Ingresa el número de identificación",
                      }}
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
                    disabled={consultLoading}
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
                    <Card className="border-dashed border-orange-200 bg-orange-50/60 shadow-none">
                      <CardContent className="flex items-center gap-3 py-6">
                        <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                        <p className="text-sm font-medium text-orange-700">
                          Consultando información del servicio. Esto puede
                          tardar unos segundos.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {!consultLoading && queryMade && (
                    <>
                      <Card className="border-[#ff6400]/40 shadow-sm shadow-[#ff6400]/10">
                        <CardHeader className="flex flex-row items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff6400]/10">
                            <User className="h-6 w-6 text-[#ff6400]" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold text-[#ff6400]">
                              Información del cliente
                            </CardTitle>
                            <CardDescription className="text-xs">
                              Verifica y actualiza los datos antes de continuar
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <Separator className=" mb-4 mt-2 bg-[#ff6400]/30" />
                        <CardContent className="space-y-6">
                          <div className="grid gap-6 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem className="space-y-2">
                                  <FormLabel className="text-sm font-semibold text-black">
                                    Nombre
                                  </FormLabel>
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
                                  <FormLabel className="text-sm font-semibold text-black">
                                    Teléfono
                                  </FormLabel>
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
                                  <FormLabel className="text-sm font-semibold text-black">
                                    Correo electrónico
                                  </FormLabel>
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
                              rules={{
                                required: "Ingresa la dirección del cliente",
                              }}
                              render={({ field }) => (
                                <FormItem className="space-y-2 sm:col-span-2">
                                  <FormLabel className="text-sm font-semibold text-black">
                                    Dirección
                                  </FormLabel>
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
                      {payments.length > 0 || additionalPayments.length > 0 ? (
                        <>
                          {/* Pagos Adicionales */}
                          {additionalPayments.length > 0 && (
                            <Card className="overflow-hidden border-blue-200 shadow-lg w-full p-0">
                              <CardContent className="p-0">
                                <CardHeader className="bg-gradient-to-b from-blue-500 to-blue-600 text-white py-3">
                                  <CardTitle className="text-xl">
                                    Pagos Adicionales
                                  </CardTitle>
                                  <CardDescription className="text-blue-50">
                                    Cobros adicionales pendientes (equipos,
                                    daños, etc.)
                                  </CardDescription>
                                </CardHeader>
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse">
                                    <thead>
                                      <tr className="bg-blue-50 border-b border-blue-200">
                                        <th className="px-6 py-4 text-left font-bold text-blue-900">
                                          Concepto
                                        </th>
                                        <th className="px-6 py-4 text-left font-bold text-blue-900">
                                          Fecha
                                        </th>
                                        <th className="px-6 py-4 text-center font-bold text-blue-900">
                                          Cuotas
                                        </th>
                                        <th className="px-6 py-4 text-right font-bold text-blue-900">
                                          Valor Total
                                        </th>
                                        <th className="px-6 py-4 text-right font-bold text-blue-900">
                                          Valor Cuota
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {additionalPayments.map((cobro) => (
                                        <tr
                                          key={cobro.id}
                                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                          <td className="px-6 py-4 text-gray-900">
                                            <div>
                                              <p className="font-medium">
                                                {cobro.observacion ||
                                                  "Pago adicional"}
                                              </p>
                                              {cobro.ultimo_pago && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                  Último pago: Cuota{" "}
                                                  {
                                                    cobro.ultimo_pago
                                                      .numero_cuota
                                                  }{" "}
                                                  -{" "}
                                                  {new Date(
                                                    cobro.ultimo_pago.fecha_pago
                                                  ).toLocaleDateString("es-CO")}
                                                </p>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-6 py-4 text-gray-700">
                                            {new Date(
                                              cobro.fecha_realizacion
                                            ).toLocaleDateString("es-CO", {
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                            })}
                                          </td>
                                          <td className="px-6 py-4 text-center text-gray-700">
                                            {cobro.cuotas}
                                          </td>
                                          <td className="px-6 py-4 text-right text-gray-700">
                                            {formatCurrency(cobro.valor_total)}
                                          </td>
                                          <td className="px-6 py-4 text-right font-semibold text-blue-700">
                                            {formatCurrency(
                                              cobro.cuotas > 0
                                                ? cobro.valor_final /
                                                    cobro.cuotas
                                                : cobro.valor_final
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="border-t-2 border-blue-500 bg-blue-50">
                                        <td
                                          colSpan={4}
                                          className="px-6 py-4 text-right text-lg font-bold text-gray-900"
                                        >
                                          Subtotal Pagos Adicionales:
                                        </td>
                                        <td className="px-6 py-4 text-right text-xl font-bold text-blue-600">
                                          {formatCurrency(
                                            additionalPayments.reduce(
                                              (sum, cobro) => {
                                                const valorCuota =
                                                  cobro.cuotas > 0
                                                    ? (cobro.valor_final || 0) /
                                                      cobro.cuotas
                                                    : 0;
                                                return sum + valorCuota;
                                              },
                                              0
                                            )
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Payments Table */}
                          {payments.length > 0 && (
                            <Card className="overflow-hidden border-orange-200 shadow-lg w-full p-0 mt-4">
                              <CardHeader className="bg-gradient-to-b from-[#ff9900] to-[#ec5406] text-white py-3">
                                <CardTitle className="text-xl">
                                  Cuentas Pendientes
                                </CardTitle>
                                <CardDescription className="text-orange-50">
                                  Detalle de los servicios a pagar
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse">
                                    <thead>
                                      <tr className="bg-orange-50 border-b border-orange-200">
                                        <th className="px-6 py-4 text-left font-bold text-orange-900">
                                          Cuenta
                                        </th>
                                        <th className="px-6 py-4 text-left font-bold text-orange-900">
                                          Servicio
                                        </th>
                                        <th className="px-6 py-4 text-left font-bold text-orange-900">
                                          Dirección
                                        </th>
                                        <th className="px-6 py-4 text-right font-bold text-orange-900">
                                          Valor
                                        </th>
                                        <th className="px-6 py-4 text-center font-bold text-orange-900">
                                          Descuento
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {payments.map((payment, index) => (
                                        <tr
                                          key={index}
                                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                        >
                                          <td className="px-6 py-4 font-medium text-gray-900">
                                            {payment.numero_cuenta as string}
                                          </td>
                                          <td className="px-6 py-4 text-gray-700">
                                            {
                                              (
                                                payment.plan as {
                                                  descripcion: string;
                                                }
                                              ).descripcion
                                            }
                                          </td>
                                          <td className="px-6 py-4 text-gray-700">
                                            {payment.direccion as string}
                                          </td>
                                          <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                            {formatCurrency(
                                              (
                                                payment.plan as {
                                                  precio: number;
                                                }
                                              ).precio
                                            )}
                                          </td>
                                          <td className="px-6 py-4 text-center">
                                            <Button
                                              variant="outline"
                                              size="icon"
                                              className="h-8 w-8 rounded-full hover:bg-orange-100 hover:border-orange-300"
                                              onClick={() => {
                                                setSelectedPaymentForDiscount(
                                                  payment
                                                );
                                                setDiscountDialogOpen(true);
                                              }}
                                              aria-label="Ver descuentos"
                                            >
                                              <Info className="h-4 w-4 text-orange-600" />
                                            </Button>
                                          </td>
                                        </tr>
                                      ))}
                                      <tr className="border-t-2 border-orange-500 bg-orange-50">
                                        <td
                                          colSpan={4}
                                          className="px-6 py-4 text-right text-lg font-bold text-gray-900"
                                        >
                                          Total a pagar:
                                        </td>
                                        <td className="px-6 py-4 text-right text-xl font-bold text-orange-600">
                                          {formatCurrency(
                                            form.getValues("amount")
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Resumen Total */}
                          {(payments.length > 0 ||
                            additionalPayments.length > 0) && (
                            <Card className="border-green-200 shadow-lg bg-green-50/50">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                      Resumen de Pago
                                    </h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                      {payments.length > 0 && (
                                        <p>
                                          Servicios de Internet:{" "}
                                          <span className="font-semibold text-gray-900">
                                            {formatCurrency(
                                              payments.reduce(
                                                (sum, payment) => {
                                                  const plan = payment?.plan as
                                                    | { precio?: number }
                                                    | undefined;
                                                  const price =
                                                    typeof plan?.precio ===
                                                    "number"
                                                      ? plan.precio
                                                      : 0;
                                                  return sum + price;
                                                },
                                                0
                                              )
                                            )}
                                          </span>
                                        </p>
                                      )}
                                      {additionalPayments.length > 0 && (
                                        <p>
                                          Pagos Adicionales:{" "}
                                          <span className="font-semibold text-gray-900">
                                            {formatCurrency(
                                              additionalPayments.reduce(
                                                (sum, cobro) => {
                                                  const valorCuota =
                                                    cobro.cuotas > 0
                                                      ? (cobro.valor_final ||
                                                          0) / cobro.cuotas
                                                      : 0;
                                                  return sum + valorCuota;
                                                },
                                                0
                                              )
                                            )}
                                          </span>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600 mb-1">
                                      Total a Pagar
                                    </p>
                                    <p className="text-3xl font-bold text-green-600">
                                      {formatCurrency(form.getValues("amount"))}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Bank Selection */}
                          <Card className="border-orange-200 shadow-lg">
                            <CardContent className="space-y-6">
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
                                          (bank) =>
                                            bank.financialInstitutionCode.toString() ===
                                            value
                                        );

                                        if (selectedBank) {
                                          form.setValue(
                                            "financialInstitutionName",
                                            selectedBank.financialInstitutionName
                                          );
                                        }
                                      }}
                                      value={field.value as string | undefined}
                                      disabled={
                                        consultLoading ||
                                        banksLoading ||
                                        banks.length === 0
                                      }
                                    >
                                      <FormControl>
                                        <SelectTrigger className="w-full truncate">
                                          <SelectValue
                                            placeholder={bankPlaceholder}
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {banksLoading ? (
                                          <SelectItem value="loading" disabled>
                                            <div className="flex items-center gap-2">
                                              <Loader2 className="h-4 w-4 animate-spin" />
                                              Cargando bancos...
                                            </div>
                                          </SelectItem>
                                        ) : (
                                          banks.map((option) => (
                                            <SelectItem
                                              key={`select-bank-${option.financialInstitutionCode}`}
                                              value={option.financialInstitutionCode.toString()}
                                            >
                                              {option.financialInstitutionName}
                                            </SelectItem>
                                          ))
                                        )}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    {banksLoading && (
                                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Cargando bancos disponibles...
                                      </p>
                                    )}
                                  </FormItem>
                                )}
                              />
                            </CardContent>
                          </Card>
                        </>
                      ) : (
                        <div className="flex items-center justify-center rounded-2xl bg-[#bfe3c3] px-6 py-4 text-sm font-semibold text-[#1f4b2c] shadow-sm">
                          <div className="flex items-center gap-3">
                            <span className="text-base">
                              Tus pagos están al día
                            </span>
                            <Smile className="h-6 w-6 text-[#1f4b2c]" />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    rules={{
                      validate: (value) =>
                        value || "Debes aceptar los términos",
                    }}
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border border-black/40 text-[#ff6400] focus:ring-[#ff6400]"
                            checked={field.value}
                            onChange={(event) =>
                              field.onChange(event.target.checked)
                            }
                          />
                          <FormLabel className="text-sm font-medium text-black">
                            Acepto los términos y condiciones
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {(payments.length > 0 || additionalPayments.length > 0) && (
                    <>
                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                        <p className="text-center text-sm text-blue-900">
                          <span className="font-semibold">Importante:</span>{" "}
                          Serás redirigido al portal de tu banco para completar
                          el pago de forma segura
                        </p>
                      </div>
                      <Button
                        variant="orange"
                        type="submit"
                        className="h-12 w-full text-base font-semibold text-white"
                        disabled={submitLoading || consultLoading}
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
            </CardContent>
          </Card>
        </main>
        {/* Dialog para mostrar detalles de descuento */}
        <Dialog open={discountDialogOpen} onOpenChange={setDiscountDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-orange-600">
                Detalles de Descuento
              </DialogTitle>
              <DialogDescription>
                Información de descuentos aplicados a la cuenta
              </DialogDescription>
            </DialogHeader>
            {selectedPaymentForDiscount && (
              <div className="space-y-6">
                {/* Información de la cuenta */}
                <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                  <h3 className="font-semibold text-lg text-gray-900">
                    Información de la Cuenta
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">
                        Número de cuenta:
                      </span>
                      <p className="text-gray-900">
                        {selectedPaymentForDiscount.numero_cuenta as string}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Dirección:
                      </span>
                      <p className="text-gray-900">
                        {selectedPaymentForDiscount.direccion as string}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">
                        Servicio:
                      </span>
                      <p className="text-gray-900">
                        {
                          (
                            selectedPaymentForDiscount.plan as {
                              descripcion: string;
                            }
                          ).descripcion
                        }
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Valor:</span>
                      <p className="text-gray-900 font-semibold">
                        {formatCurrency(
                          (
                            selectedPaymentForDiscount.plan as {
                              precio: number;
                            }
                          ).precio
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de cupones/descuentos */}
                {selectedPaymentForDiscount.cupones &&
                Array.isArray(selectedPaymentForDiscount.cupones) &&
                selectedPaymentForDiscount.cupones.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Descuentos Aplicados
                    </h3>
                    <div className="space-y-3">
                      {(
                        selectedPaymentForDiscount.cupones as Array<{
                          id: number;
                          codigo: string;
                          descripcion: string;
                          razon?: string;
                          valor_descuento?: number;
                          fechaCreacion?: string;
                          fecha_fin?: string;
                          activo?: boolean;
                          tipo_descuento_descripcion: string;
                        }>
                      ).map((cupon, index) => (
                        <Card
                          key={cupon.id || index}
                          className="py-2 border-orange-200 bg-orange-50/50"
                        >
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-3">
                                {/* Tipo de descuento y porcentaje destacados */}
                                <div className="flex items-center justify-between gap-4 pb-3 border-b border-orange-200">
                                  <div className="flex-1">
                                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                      Tipo de Descuento
                                    </span>
                                    <p className="text-lg font-bold text-orange-700 mt-1">
                                      {cupon.tipo_descuento_descripcion ||
                                        cupon.razon ||
                                        cupon.descripcion}
                                    </p>
                                  </div>
                                  {cupon.valor_descuento && (
                                    <div className="text-right">
                                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide block">
                                        Descuento
                                      </span>
                                      <p className="text-2xl font-bold text-orange-600 mt-1">
                                        {cupon.valor_descuento}%
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Código del cupón */}
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-orange-900 text-sm">
                                    Código:
                                  </span>
                                  <span className="text-sm font-mono bg-white px-3 py-1.5 rounded border border-orange-200 text-gray-800">
                                    {cupon.codigo}
                                  </span>
                                </div>

                                {/* Descripción */}
                                <div>
                                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">
                                    Descripción
                                  </span>
                                  <p className="text-gray-700 text-sm">
                                    {cupon.descripcion}
                                  </p>
                                </div>

                                {/* Información adicional */}
                                <div className="flex flex-wrap gap-4 text-sm pt-2 border-t border-orange-100">
                                  {cupon.valor_descuento && (
                                    <div>
                                      <span className="font-medium text-gray-700 block text-xs uppercase tracking-wide mb-1">
                                        Valor del Descuento
                                      </span>
                                      <span className="text-orange-600 font-semibold text-base">
                                        {formatCurrency(
                                          (() => {
                                            const precioOriginal = (
                                              selectedPaymentForDiscount.plan as {
                                                precio: number;
                                              }
                                            ).precio;
                                            return (
                                              (precioOriginal *
                                                cupon.valor_descuento) /
                                              100
                                            );
                                          })()
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {cupon.fecha_fin && (
                                    <div>
                                      <span className="font-medium text-gray-700 block text-xs uppercase tracking-wide mb-1">
                                        Fecha de Vencimiento
                                      </span>
                                      <span className="text-gray-600">
                                        {new Date(
                                          cupon.fecha_fin
                                        ).toLocaleDateString("es-CO", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-center">
                    <p className="text-yellow-800 font-medium">
                      No hay descuentos aplicados a esta cuenta
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
        <TransactionDialog
          open={verificationDialogOpen}
          onOpenChange={handleDialogOpenChange}
          transactionId={transactionId ?? undefined}
          newPaymentHref="/pse"
          homeHref="/"
        />
      </div>
    </>
  );
}
