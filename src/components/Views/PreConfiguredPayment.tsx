import PSEService from "@/services/PSEService";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AlertTriangle, CreditCard, Info, Lock, User } from "lucide-react";
import { formatCurrency, userTypes, type PseFormValues, type selectTypeOption } from "@/lib/pse";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ClientService from "@/services/ClientService";
import { zodResolver } from "@hookform/resolvers/zod";
import { PseSchema } from "@/utils/Pse.schema";
import ReCAPTCHA from "react-google-recaptcha";

function PreConfiguredPayment({ paymentId }: { paymentId: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banks, setBanks] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [paymentRedeemed, setPaymentRedeemed] = useState(false);
  const [identificationTypes, setIdentificationTypes] = useState<selectTypeOption[]>([]);
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "";
  const form = useForm<PseFormValues>(
    {
      resolver: zodResolver(PseSchema),
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
      },
    });

  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        setLoading(true);
        const [paymentResponse, identifyTypesResponse, banksResponse] = await Promise.all([PSEService.paymentConsultByID(paymentId), ClientService.getIdentifyTypes(), PSEService.getBanks()]);

        if (paymentResponse.success && identifyTypesResponse.success && banksResponse.success) {
          // Validar el estado del pago
          const estado = paymentResponse.generateUrl.estado;

          if (estado === 0) {
            // El pago ya fue canjeado
            setPaymentRedeemed(true);
            setError("Este pago ya ha sido canjeado y no puede ser procesado nuevamente.");
          } else if (estado === 1) {
            // El pago está disponible para procesar
            form.setValue("paymentDescription", paymentResponse.generateUrl.concepto);
            form.setValue("amount", paymentResponse.generateUrl.valor);
            form.setValue("idUrlGenerated", Number(paymentResponse.generateUrl.id));
            setIdentificationTypes(identifyTypesResponse.tipos_identificacion);
            setBanks(banksResponse.bancos);
          } else {
            setError("Estado de pago no válido");
          }
        } else {
          setError(paymentResponse.message || "No se pudo cargar la información");
        }
      } catch (err) {
        setError("Error al cargar la información del pago");
      } finally {
        setLoading(false);
      }
    };

    loadPaymentData();
  }, []);

  const withTokenRetry = async (fn: () => Promise<any>): Promise<any> => {
    try {
      return await fn();
    } catch (err: any) {
      const isTokenExpired =
        err.response?.data?.error === "PSE_TOKEN_EXPIRED" ||
        err.response?.status === 403;
      if (isTokenExpired) {
        console.log("[PSE] Token expirado, refrescando y reintentando...");
        await PSEService.getBanks();
        return await fn();
      }
      throw err;
    }
  };

  const onSubmit = async (values: PseFormValues) => {
    setSubmitting(true);
    try {
      const response = await withTokenRetry(() =>
        PSEService.generatePayment(JSON.stringify(values))
      );
      if (response.returnCode === "SUCCESS") {
        window.location.href = response.pseURL;
      } else {
        setError(response.message || "Error al generar el enlace de pago");
      }
    } catch (err) {
      setError("Error al procesar el pago");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || paymentRedeemed) {
    return (
      <div className=" flex items-center justify-center p-0 sm:p-6 md:p-8">
        <Card className="max-w-md w-full border-2 border-red-200 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
              {/* Icono con fondo */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />
              </div>

              {/* Título */}
              <h2 className="text-xl sm:text-2xl font-bold text-red-600 px-2">
                {paymentRedeemed ? "Pago ya canjeado" : "Error"}
              </h2>

              {/* Mensaje */}
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed px-2">
                {error || "Este enlace de pago ya ha sido utilizado y no puede ser procesado nuevamente."}
              </p>

              {/* Línea divisoria */}
              <div className="w-full border-t border-red-200 my-2"></div>

              {/* Información adicional */}
              <div className="bg-red-50 rounded-lg p-3 sm:p-4 w-full">
                <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                  {paymentRedeemed
                    ? "Si crees que esto es un error, por favor contacta a nuestro equipo de soporte."
                    : "Si el problema persiste, por favor contacta a nuestro equipo de soporte."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Form {...form} >
      <form onSubmit={(e) => {
        e.preventDefault();
        form
          .handleSubmit(onSubmit)()
          .catch((err) => console.error("Error en submit:", err));
      }} className="p-6 space-y-6">
        {/* Alerta informativa */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex">
          <Info className="mr-2 h-5 w-5 text-blue-600" />
          <p className="text-sm text-blue-900">
            Este pago fue creado por un de nuestros colaboradores. Por favor, verifica los datos antes de continuar.
          </p>
        </div>

        {/* Información del cliente */}
        <Card className="border border-orange-200 rounded-lg p-6">
          <CardTitle className="font-semibold text-lg">Información del Cliente</CardTitle>
          <CardContent className="space-y-2 p-1">
            <div className="grid p-0 gap-2 sm:grid-cols-2 w-full max-w-full overflow-hidden">
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
                        identificationTypes.length === 0
                      }
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input className="h-8 border border-black/10 text-sm text-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="identificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identificación</FormLabel>
                    <FormControl>
                      <Input className="h-8 border border-black/10 text-sm text-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input className="h-8 border border-black/10 text-sm text-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input className="h-8 border border-black/10 text-sm text-black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input className="h-8 border border-black/10 text-sm text-black" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Selector de banco */}
        <Card className="border border-orange-200 rounded-lg p-6">
          <FormField
            control={form.control}
            name="financialInstitutionCode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="flex items-center gap-2 text-lg font-medium">
                  <CreditCard className="h-4 w-4 text-[#ff6400]" />
                  Seleccione su banco *
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const bank = banks.find(b => b.financialInstitutionCode.toString() === value);
                    if (bank) {
                      form.setValue("financialInstitutionName", bank.financialInstitutionName);
                    }
                  }}
                  value={field.value === "0" ? undefined : field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona tu banco" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem
                        key={bank.financialInstitutionCode}
                        value={bank.financialInstitutionCode.toString()}
                      >
                        {bank.financialInstitutionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        {/* Resumen del pago */}
        <Card className="bg-green-50 border border-green-200 rounded-lg ">
          <CardHeader>
            <CardTitle className="font-semibold text-lg">Resumen del Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <span className="text-gray-600">Descripción:</span>
              <span className="font-medium text-right max-w-xs">{form.watch("paymentDescription")}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-green-200">
              <span className="text-gray-600">Monto a pagar:</span>
              <span className="font-bold text-green-600 text-2xl">
                {formatCurrency(form.watch("amount"))}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Términos y condiciones */}
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
              </FormControl>
              <FormLabel className="text-sm font-medium text-gray-700 !mt-0">
                Acepto los términos y condiciones
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Alerta de redirección */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-center text-sm text-blue-900">
            <span className="font-semibold">Importante:</span> Serás redirigido al portal de tu banco para completar el pago de forma segura
          </p>
        </div>

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
        {/* Botón de pago */}
        <Button
          variant="orange"
          type="submit"
          disabled={submitting}
          className="w-full h-12 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generando enlace de pago...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-5 w-5" />
              Continuar al pago seguro
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default PreConfiguredPayment;