import Menu from "@/Layouts/Menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Loader2,
  Lock,
  Smile,
  User,
} from "lucide-react";
import { TransactionDialog } from "@/components/TransactionDialog";
import axios from "axios";

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
  const [identTypesLoading, setIdentTypesLoading] = useState(false);
  const [consultLoading, setConsultLoading] = useState(false);
  const [banksLoading, setBanksLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

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

    if (payments.length === 0) {
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
  }, [apiUrl, payments]);

  const onConsult = async () => {
    if (!apiUrl) {
      console.warn("VITE_API_URL is not defined");
      return;
    }

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
            }

            const cuentas = responseCorte.data.cuentas as Record<
              string,
              unknown
            >[];
            setPayments(cuentas);

            const totalAmount = cuentas.reduce((sum, payment) => {
              const plan = payment?.plan as { precio?: number } | undefined;
              const price = typeof plan?.precio === "number" ? plan.precio : 0;
              return sum + price;
            }, 0);

            const paymentDescription = cuentas
              .map((payment) => {
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
              })
              .filter(Boolean)
              .join(" | ");

            form.setValue("amount", totalAmount);
            form.setValue("paymentDescription", paymentDescription);
            setQueryMade(true);
          } else {
            const cliente = responseCorte.data.cliente;
            if (cliente) {
              form.setValue("name", cliente.nombre ?? "");
              form.setValue("phone", cliente.telefono ?? "");
              form.setValue("email", cliente.correo ?? "");
              form.setValue("address", cliente.direccion ?? "");
            }
            setPayments([]);
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
    return new Intl.NumberFormat("es-CO").format(value);
  };

  const onSubmit = async (values: PseFormValues) => {
    if (!apiUrl) {
      console.warn("VITE_API_URL is not defined");
      return;
    }

    setSubmitLoading(true);
    const token = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("pse_token="))
      ?.split("=")[1];

    const payload: PseFormValues = {
      ...values,
      ticketId: new Date().getTime().toString(),
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
        window.location.href = response.data.pseURL;
      } else {
        console.error("Error generating payment link:", response.data);
      }
    } catch (error) {
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
              Completa el formulario para consultar tu servicio y pagar de forma
              segura.
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
                        Consultando información del servicio. Esto puede tardar
                        unos segundos.
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
                    {payments.length > 0 ? (
                      <>
                        {/* Payments Table */}
                        <Card className="overflow-hidden border-orange-200 shadow-lg w-full p-0">
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
                                          (payment.plan as { precio: number })
                                            .precio
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className="border-t-2 border-orange-500 bg-orange-50">
                                    <td
                                      colSpan={3}
                                      className="px-6 py-4 text-right text-lg font-bold text-gray-900"
                                    >
                                      Total a pagar:
                                    </td>
                                    <td className="px-6 py-4 text-right text-xl font-bold text-orange-600">
                                      {formatCurrency(form.getValues("amount"))}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </Card>
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
                    validate: (value) => value || "Debes aceptar los términos",
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
                {payments.length > 0 && (
                  <>
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <p className="text-center text-sm text-blue-900">
                        <span className="font-semibold">Importante:</span> Serás
                        redirigido al portal de tu banco para completar el pago
                        de forma segura
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
      <TransactionDialog
        open={verificationDialogOpen}
        onOpenChange={handleDialogOpenChange}
        transactionId={transactionId ?? undefined}
        newPaymentHref="/pse"
        homeHref="/"
      />
    </div>
  );
}
