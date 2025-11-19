import Menu from "@/Layouts/Menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Wifi,
} from "lucide-react";

const factoresCliente = [
  "Equipos de cómputo",
  "Sistema operativo: Windows 2000/XP/7/8/10 o inferior, o Mac OS 8.6 o inferior.",
  "Procesador: Intel Pentium PIII / AMD K-6.",
  "Memoria RAM: mínimo 1 GB.",
  "Almacenamiento: al menos 2 GB libres en disco.",
  "Tarjeta de red alámbrica: 100 Mbps o inferior, con puerto Ethernet.",
  "Tarjeta inalámbrica (WiFi): compatible con estándar 802.11b (recomendado 802.11 b/g/n).",
];

const factoresSoftware = [
  "Virus y malware pueden reducir el rendimiento de sus equipos y navegadores.",
  "Instala y mantén actualizados programas antivirus, antispyware y antimalware.",
  "Los programas de descarga P2P (Ares, Limewire, etc.) consumen gran ancho de banda al recibir y enviar datos.",
  "Utiliza navegadores preferiblemente sin extensiones pesadas.",
];

const redInterna = [
  "Mantén el cableado en buen estado y libre de cortes o empalmes fraudulentos.",
  "Evita instalar splitters u otros dispositivos pasivos antes del cable módem.",
  "El número de dispositivos conectados simultáneamente (por WiFi o cable) influye directamente en la velocidad disponible.",
];

const coberturaWifi = [
  "La distancia recomendada entre el módem y el dispositivo no debe superar 7 metros sin obstáculos.",
  "Paredes, techos y materiales como aluminio, cristal, acero, ladrillo, hormigón y agua pueden afectar la señal.",
  "Teléfonos inalámbricos, hornos microondas, sistemas de seguridad y otros equipos electrónicos pueden interferir incluso cuando no están en uso.",
];

const factoresInttelgo = [
  "Mantenimientos programados garantizan la calidad del servicio.",
  "Interrupciones por daños fortuitos de red ocasionados por accidentes o actos de terceros.",
  "Calidad de la red de distribución: cableado deteriorado, manipulación indebida o conexiones ilegales.",
  "Capacidad de conexión en redes de agregación o en el canal internacional.",
];

const factoresExternos = [
  "Problemas en el origen de las páginas web visitadas: servidores saturados o con ancho de banda limitado.",
  "Fallos técnicos en los servidores de destino.",
  "Interrupciones o congestión en el canal internacional de conexión a Internet.",
];

const secciones = [
  {
    titulo: "1. Factores relacionados con el cliente",
    descripcion: "Revisa el estado de tus equipos y conexiones internas.",
    items: factoresCliente,
  },
  {
    titulo: "2. Software y seguridad",
    descripcion: "Mantén tu ecosistema digital protegido y optimizado.",
    items: factoresSoftware,
  },
  {
    titulo: "3. Red interna del hogar",
    descripcion: "Verifica cableado, dispositivos y distribución de la red.",
    items: redInterna,
  },
  {
    titulo: "4. Cobertura e interferencias WiFi",
    descripcion: "Considera la distancia y los obstáculos alrededor del módem.",
    items: coberturaWifi,
    icono: <Wifi className="h-6 w-6 text-[#ff6400]" />,
  },
  {
    titulo: "5. Factores relacionados con INTTELGO",
    descripcion: "Procesos internos que influyen en la calidad del servicio.",
    items: factoresInttelgo,
    icono: <ShieldCheck className="h-6 w-6 text-[#ff6400]" />,
  },
  {
    titulo: "6. Factores externos",
    descripcion: "Elementos fuera de tu red que pueden afectar la velocidad.",
    items: factoresExternos,
  },
];

const categorias = [
  { label: "Cliente", color: "bg-[#fff4ec] text-[#ff6400]" },
  { label: "INTTELGO S.A.S.", color: "bg-[#e5f5ff] text-[#005f9e]" },
  { label: "Factores externos", color: "bg-[#f0f1f5] text-black" },
];

export default function Manual() {
  return (
    <div className="bg-[#f7f8fb]">
      <Menu
        className={"text-black hover:text-black/80"}
        textColor="text-black hover:text-black/80"
        detailsColor=""
        lineColor="bg-black/50"
      />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12 sm:px-6 md:px-10 lg:px-0">
        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="flex flex-col items-center gap-4 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-black text-white">
              <BookOpen className="h-10 w-10" />
            </div>
            <CardTitle className="text-4xl font-extrabold uppercase tracking-tight text-black sm:text-5xl">
              Manual de usuario
            </CardTitle>
            <CardDescription className="max-w-3xl text-base text-muted-foreground">
              Factores que pueden limitar la velocidad de su Internet Fijo.
              INTTELGO S.A.S. y su equipo de ingenieros especializados informan
              que la velocidad de navegación puede verse afectada por diferentes
              factores, agrupados en tres categorías.
            </CardDescription>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {categorias.map((categoria) => (
                <Badge
                  key={categoria.label}
                  variant="secondary"
                  className={`rounded-full px-4 py-1 text-sm font-medium ${categoria.color}`}
                >
                  {categoria.label}
                </Badge>
              ))}
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-8">
          {secciones.map(({ titulo, descripcion, items, icono }) => (
            <Card
              key={titulo}
              className="border-black/10 shadow-lg shadow-black/5"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold text-[#ff6400]">
                      {titulo}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {descripcion}
                    </CardDescription>
                  </div>
                  {icono && (
                    <div className="rounded-full bg-[#fff4ec] p-3">{icono}</div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Separator className="bg-black/10" />
                <ul className="list-disc space-y-2 pl-6 text-sm sm:text-base">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-[#ff6400]/40 bg-[#fff4ec] text-[#a13d00] shadow-lg shadow-black/5">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-1 h-6 w-6 flex-shrink-0 text-[#ff6400]" />
              <p className="text-sm sm:text-base">
                Nota final: Las recomendaciones y factores descritos se basan en
                la experiencia de INTTELGO S.A.S., considerando las incidencias
                más comunes registradas por nuestros equipos de ayuda y soporte
                técnico.
              </p>
            </div>
            <Separator className="bg-[#ff6400]/40" />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 font-semibold uppercase tracking-wide">
                <ShieldCheck className="h-5 w-5 text-[#ff6400]" />
                Régimen de la protección de los usuarios
              </div>
              <a
                href="https://www.mintic.gov.co/portal/inicio/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#ff6400] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#e05a00]"
              >
                Resolución 511 de 2017
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
