import Menu from "@/Layouts/Menu";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/SEO";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PSEService from "@/services/PSEService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/PageHeader";
import { formatCurrency, type couponType } from "@/lib/pse";
import NormalPaymentFlow from "@/components/Views/NormalPaymentFlow";
import TransactionVerification from "@/components/Views/TransactionVerification";
import PreConfiguredPayment from "@/components/Views/PreConfiguredPayment";

export default function Pse() {
  const { transaction: transactionParam, payment: paymentParam } = useParams<{ transaction?: string, payment?: string }>();
  // Obtener query parameters
  const [searchParams] = useSearchParams();
  const transaction = searchParams.get("transaction") || transactionParam;
  const payment = searchParams.get("payment") || paymentParam;

  const [selectedPaymentForDiscount, setSelectedPaymentForDiscount] =
    useState<Record<string, unknown> | null>(null);
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);

  useEffect(() => {
    PSEService.generarToken().catch(() => {
      // Fallo silencioso: el token se obtendrá en getBanks si este endpoint falla
    });
  }, []);

  // Si no hay parámetros, mostrar el flujo normal de pago
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
      <div className="bg-[#f7f8fb] overflow-x-hidden">
        <Menu
          className={"text-black hover:text-black/80"}
          textColor="text-black hover:text-black/80"
          detailsColor=""
          lineColor="bg-black/50"
        />
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-12 sm:px-6 md:px-10 lg:px-0 overflow-x-hidden">
          <Card className="overflow-hidden border-black/10 bg-white shadow-lg shadow-black/5 p-0 w-full">
            <div className="bg-gradient-to-b from-[#ff9900] to-[#ec5406] p-4 sm:p-6 text-white">
              <h1 className="text-xl sm:text-2xl font-semibold break-words">
                PSE - Pago en línea
              </h1>
            </div>
            <PageHeader
              title="Ingresa los datos para realizar tu pago"
              subtitle="Completa el formulario para consultar tu servicio y pagar de forma segura."
              logoLeft="mano-inttelgo-50px.svg"
              logoRight="Logos PSE_180x180.png"
              logoLeftAlt="INTTELGO"
              logoRightAlt="PSE"
            />
            <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
              {transaction ? (
                <TransactionVerification transactionId={transaction} />
              ) : payment ? (
                <PreConfiguredPayment paymentId={payment} />
              ) : (
                <NormalPaymentFlow
                  handleSelectPaymentForDiscount={setSelectedPaymentForDiscount}
                  handleDiscountDialogOpen={setDiscountDialogOpen}
                />)}
            </CardContent>
          </Card>
        </main>
        {/* Dialog para mostrar detalles de descuento */}
        <Dialog open={discountDialogOpen} onOpenChange={setDiscountDialogOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto overflow-x-hidden">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-orange-600 break-words">
                Detalles de Descuento
              </DialogTitle>
              <DialogDescription className="break-words">
                Información de descuentos aplicados a la cuenta
              </DialogDescription>
            </DialogHeader>
            {selectedPaymentForDiscount && (
              <div className="space-y-6">
                {/* Información de la cuenta */}
                <div className="rounded-lg bg-gray-50 p-4 space-y-2 overflow-x-hidden">
                  <h3 className="font-semibold text-lg text-gray-900 break-words">
                    Información de la Cuenta
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="min-w-0">
                      <span className="font-medium text-gray-700">
                        Número de cuenta:
                      </span>
                      <p className="text-gray-900 break-words">
                        {selectedPaymentForDiscount.numero_cuenta as string}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-gray-700">
                        Dirección:
                      </span>
                      <p className="text-gray-900 break-words">
                        {selectedPaymentForDiscount.direccion as string}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-gray-700">
                        Servicio:
                      </span>
                      <p className="text-gray-900 break-words">
                        {
                          (
                            selectedPaymentForDiscount.plan as {
                              descripcion: string;
                            }
                          ).descripcion
                        }
                      </p>
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-gray-700">Valor:</span>
                      <p className="text-gray-900 font-semibold break-words">
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
                  <div className="space-y-4 overflow-x-hidden">
                    <h3 className="font-semibold text-lg text-gray-900 break-words">
                      Descuentos Aplicados
                    </h3>
                    <div className="space-y-3">
                      {(
                        selectedPaymentForDiscount.cupones as Array<couponType>
                      ).map((cupon, index) => (
                        <Card
                          key={cupon.id || index}
                          className="py-2 border-orange-200 bg-orange-50/50 overflow-hidden"
                        >
                          <CardContent className="p-4 space-y-3 overflow-x-hidden">
                            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
                              <div className="flex-1 space-y-3 min-w-0">
                                {/* Tipo de descuento y porcentaje destacados */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-orange-200">
                                  <div className="flex-1 min-w-0">
                                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                      Tipo de Descuento
                                    </span>
                                    <p className="text-base sm:text-lg font-bold text-orange-700 mt-1 break-words">
                                      {cupon.tipo_descuento_descripcion ||
                                        cupon.razon ||
                                        cupon.descripcion}
                                    </p>
                                  </div>
                                  {cupon.valor_descuento && (
                                    <div className="text-left sm:text-right flex-shrink-0">
                                      <span className="text-xs font-medium text-gray-600 uppercase tracking-wide block">
                                        Descuento
                                      </span>
                                      <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-1">
                                        {cupon.valor_descuento}%
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Código del cupón */}
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-semibold text-orange-900 text-sm">
                                    Código:
                                  </span>
                                  <span className="text-xs sm:text-sm font-mono bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-orange-200 text-gray-800 break-all">
                                    {cupon.codigo}
                                  </span>
                                </div>

                                {/* Descripción */}
                                <div className="min-w-0">
                                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide block mb-1">
                                    Descripción
                                  </span>
                                  <p className="text-gray-700 text-xs sm:text-sm break-words">
                                    {cupon.descripcion}
                                  </p>
                                </div>

                                {/* Información adicional */}
                                <div className="flex flex-col sm:flex-row flex-wrap gap-4 text-xs sm:text-sm pt-2 border-t border-orange-100">
                                  {cupon.valor_descuento && (
                                    <div className="min-w-0">
                                      <span className="font-medium text-gray-700 block text-xs uppercase tracking-wide mb-1">
                                        Valor del Descuento
                                      </span>
                                      <span className="text-orange-600 font-semibold text-sm sm:text-base break-words">
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
                                    <div className="min-w-0">
                                      <span className="font-medium text-gray-700 block text-xs uppercase tracking-wide mb-1">
                                        Fecha de Vencimiento
                                      </span>
                                      <span className="text-gray-600 break-words">
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
      </div>
    </>
  );
}