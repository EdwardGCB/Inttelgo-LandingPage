import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Menu from "@/Layouts/Menu";
import { AlertTriangle, FileText, Mail } from "lucide-react";

export default function Pqrs() {
  const pasos = [
    "Nombre completo",
    "Tipo de identificación (Cédula, Pasaporte, etc.)",
    "Número de identificación",
    "Teléfono de contacto",
    "Tipo de solicitud (Petición, Queja, Reclamo o Recurso)",
    "Descripción detallada de la solicitud",
    "Evidencias (opcional: fotos, documentos o capturas de pantalla)",
  ];

  const etiquetas = ["Petición", "Queja", "Reclamo", "Recurso"];

  return (
    <div className="bg-[#f7f8fb]">
      <Menu
        className={"text-black hover:text-black/80"}
        textColor="text-black hover:text-black/80"
        detailsColor=""
        lineColor="bg-black/50"
      />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-12 sm:px-6 md:px-10 lg:px-0">
        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-extrabold uppercase tracking-tight text-black sm:text-5xl">
              Pasos para realizar un PQR
            </CardTitle>
            <CardDescription className="mt-4 text-base text-muted-foreground sm:text-lg">
              Si deseas presentar una Petición, Queja o Reclamo (PQR), envía un
              correo electrónico a{" "}
              <a
                href="mailto:pqr@inttelgo.com"
                className="font-semibold text-[#ff6400] hover:underline"
              >
                pqr@inttelgo.com
              </a>{" "}
              con la siguiente información:
            </CardDescription>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {etiquetas.map((label) => (
                <Badge
                  key={label}
                  variant="secondary"
                  className="rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]"
                >
                  {label}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="gap-3">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-black/10 bg-[#f4f5f9]">
              <FileText className="h-10 w-10 text-black/70" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold uppercase text-black">
                Información requerida
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Suministra todos los datos para que podamos responder
                oportunamente.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ol className="space-y-3 text-base leading-relaxed text-black">
              {pasos.map((paso, index) => (
                <li key={paso} className="flex items-start gap-3">
                  <span className="mt-[2px] flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#ff6400] text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{paso}</span>
                </li>
              ))}
            </ol>
            <div className="flex items-start gap-3 rounded-2xl border border-[#ff6400]/40 bg-[#fff4ec] p-5 text-sm text-[#a13d00]">
              <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-[#ff6400]" />
              <p className="font-medium">
                Asegúrate de que la información sea clara y completa para
                agilizar la respuesta a tu PQR.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="flex items-center gap-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-black/10 bg-[#f4f5f9]">
              <Mail className="h-8 w-8 text-black/70" />
            </div>
            <div>
              <CardTitle className="text-3xl font-semibold uppercase text-black">
                Ejemplo de correo PQR
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Puedes utilizar este formato como referencia para redactar tu
                mensaje.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card className="border border-black/10 bg-[#fdfdfd] p-0">
              <div className="grid grid-cols-1 gap-6 border-b border-black/10 bg-black/5 p-6 text-sm text-black sm:grid-cols-2 sm:text-base">
                <div>
                  <span className="font-semibold uppercase tracking-wide text-black/70">
                    Para:
                  </span>
                  <p>pqr@inttelgo.com</p>
                </div>
                <div>
                  <span className="font-semibold uppercase tracking-wide text-black/70">
                    Asunto:
                  </span>
                  <p>PQR – Queja por fallas en el servicio</p>
                </div>
              </div>
              <div className="space-y-4 p-6 text-sm leading-relaxed text-black sm:text-base">
                <div className="space-y-1">
                  <p>
                    <strong>Nombre completo:</strong> Juan Pérez López
                  </p>
                  <p>
                    <strong>Tipo de identificación:</strong> Cédula de
                    ciudadanía
                  </p>
                  <p>
                    <strong>Número de identificación:</strong> 1.234.567.890
                  </p>
                  <p>
                    <strong>Teléfono de contacto:</strong> 300 123 4567
                  </p>
                  <p>
                    <strong>Tipo de solicitud:</strong> Queja
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-black">
                    Descripción:
                  </h3>
                  <p>
                    Desde el pasado 10 de agosto, mi servicio de internet ha
                    presentado interrupciones constantes, especialmente en horas
                    de la noche. Esto ha afectado mi trabajo y mis clases
                    virtuales.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-black">
                    Evidencias:
                  </h3>
                  <p>
                    Adjunto capturas de pantalla del medidor de velocidad y
                    fotografías del router con las luces apagadas.
                  </p>
                </div>
              </div>
            </Card>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
