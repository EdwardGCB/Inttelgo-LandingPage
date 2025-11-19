import Menu from "@/Layouts/Menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { externalLink } from "@/lib/utils";

const normativaLinks = [
  {
    label: "Ley 1336 de 2009",
    href: "https://inttelgo.com/wp-content/uploads/dignidadInfantil/Ley_1336_de_2009.pdf",
  },
  {
    label: "Ley 679 de 2001",
    href: "https://inttelgo.com/wp-content/uploads/dignidadInfantil/Ley_679_de_2001.pdf",
  },
  {
    label: "Decreto 1524 de 2002",
    href: "https://inttelgo.com/wp-content/uploads/dignidadInfantil/Decreto_1524_de_2002.pdf",
  },
];

const preguntas = [
  {
    title: "¿Qué busca la Ley 679 de 2001?",
    body: (
      <>
        Dictar medidas de protección contra la explotación, la pornografía y el
        turismo sexual y demás formas de abuso sexual con menores de edad,
        mediante el establecimiento de normas de carácter preventivo y
        sancionatorio, y la expedición de otras disposiciones en desarrollo del
        artículo 44 de la Constitución de Colombia.
        <br />
        Si encuentra algún contenido o actividad dentro de la red considerado
        como pornografía infantil puede denunciarlo.
      </>
    ),
  },
  {
    title: "¿Qué hace el Ministerio de Comunicaciones con estas denuncias?",
    body: (
      <>
        Las denuncias recibidas por el Ministerio de Comunicaciones sobre
        páginas de pornografía con menores de edad en Internet, son enviadas a
        la Policía Nacional y/o al Departamento Administrativo de Seguridad DAS.
        Estas entidades adelantan el proceso de verificación, análisis e
        investigación de las URL y a su vez suministran al Ministerio de
        Comunicaciones un listado de URL clasificados como pornografía con
        menores de edad en Internet. El Ministerio, con este listado, expide un
        acto administrativo exigiendo a los ISP (Proveedor de acceso a Internet)
        el bloqueo de estas páginas en Colombia. Para más información puede
        consultar las siguientes referencias:
        <ul className="space-y-2 text-base font-semibold text-black">
          {normativaLinks.map((link) => (
            <li key={link.label} className="flex items-center gap-2">
              <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
              {externalLink(link.label, link.href)}
            </li>
          ))}
        </ul>
      </>
    ),
  },
];

const programasFiltrado = [
  "CyberPatrol",
  "NetNanny",
  "Family.net",
  "K9 Web Protection",
];

const puntosDenuncia = [
  {
    title: "El MinTIC, puntos de información y denuncia:",
    items: [
      "Línea telefónica gratuita nacional: 01 8000 912667",
      <>
        Sitio Web:{" "}
        {externalLink("www.teprotejo.org", "https://www.teprotejo.org")}
      </>,
    ],
  },
];

const otrosSitios = [
  {
    title: "Fiscalía General de la Nación",
    items: [
      "Teléfono: 01 8000 0912280",
      <>
        Sitio Web (L.S.C):{" "}
        {externalLink(
          "www.fiscalia.gov.co/colombia/",
          "https://www.fiscalia.gov.co/colombia/"
        )}
      </>,
      "Correo electrónico: contacto@fiscalia.gov.co",
    ],
  },
  {
    title: "Instituto Colombiano de Bienestar Familiar",
    items: [
      "Teléfonos: 01 8000 918080 ó (1) 660 5520, (1) 660 5530, (1) 660 5540",
      "Horario de atención: 7am a 9pm de lunes a domingo",
      <>
        Página Web: {externalLink("www.icbf.gov.co", "https://www.icbf.gov.co")}
      </>,
    ],
  },
  {
    title: "Dirección central de policía judicial – Dijin",
    items: [
      "Carrera 77A # 45-61 Barrio Modelia",
      "Teléfonos PBX: 426 6900 Ext. 6301-6302",
      "Teléfono directo: 426 6300",
      "Correo: adelinfo@dijin.policia.gov.co",
      <>
        Sitio Web:{" "}
        {externalLink(
          "www.policia.gov.co/dijin",
          "https://www.policia.gov.co/dijin"
        )}
      </>,
    ],
  },
  {
    title: "CENTRO CIBERNETICO DE LA POLICIA",
    items: [
      <>
        Sitio Web:{" "}
        {externalLink(
          "caivirtual.policia.gov.co/",
          "https://caivirtual.policia.gov.co/"
        )}
      </>,
    ],
  },
];

export default function DignidadInfantil() {
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
          <CardHeader className="flex flex-col items-center gap-4 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-black text-white">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <CardTitle className="text-4xl font-extrabold uppercase tracking-tight text-black sm:text-5xl">
              Protección contra la pornografía infantil
            </CardTitle>
            <CardDescription className="max-w-3xl text-base text-muted-foreground">
              Cero tolerancia con la explotación de menores de edad en redes
              electrónicas. Para prevenir y contrarrestar el flagelo de este
              fenómeno en Colombia y el mundo denuncia en:
            </CardDescription>
            <Button
              variant="link"
              className="gap-1 text-lg font-semibold text-[#ff6400] hover:text-[#d95300]"
              asChild
            >
              {externalLink(
                "www.enticconfio.gov.co",
                "https://ciberpaz.gov.co/portal/"
              )}
            </Button>
          </CardHeader>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader>
            <Badge className="w-fit rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]">
              Dignidad infantil
            </Badge>
            <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
              Dignidad infantil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base text-muted-foreground">
            <p>
              La Pornografía Infantil se define como toda representación, por
              cualquier medio, de un menor o una persona con aspecto de menor
              entregada a actividades sexuales explicitas, reales, simuladas o
              creadas mediante procesos de cualquier índole, así como toda
              representación de las partes de unos menores reales, simulados o
              creados mediante procesos de cualquier índole con fines sexuales.
              Para lo cual se considerará menor a toda persona que no haya
              alcanzado la edad legal en la cual sea definido el carácter de
              adulto.
            </p>
          </CardContent>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="space-y-4">
            <Badge className="w-fit rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]">
              Normativa
            </Badge>
            <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
              Normativa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-muted-foreground">
            <p>
              De acuerdo con lo establecido en la{" "}
              {externalLink(
                "Ley 679 de 2001",
                "https://inttelgo.com/wp-content/uploads/dignidadInfantil/Ley_679_de_2001.pdf"
              )}{" "}
              el{" "}
              {externalLink(
                "Decreto 1524 de 2002",
                "https://inttelgo.com/wp-content/uploads/dignidadInfantil/Decreto_1524_de_2002.pdf"
              )}
              , el Decreto 67 de 2003 y la{" "}
              {externalLink(
                "Ley 1336 de 2009",
                "https://inttelgo.com/wp-content/uploads/dignidadInfantil/Ley_1336_de_2009.pdf"
              )}
              , todas las personas deben prevenir, bloquear, combatir y
              denunciar la explotación, alojamiento, uso, publicación, difusión
              de imágenes, textos, documentos, archivos audiovisuales, uso
              indebido de redes globales de información, o el establecimiento de
              vínculos telemático de cualquier clase, relacionados con material
              pornográfico o alusivo a actividades sexuales de menores de edad,
              por cuanto podría generar responsabilidad penal.
            </p>
          </CardContent>
        </Card>

        {preguntas.map((pregunta) => (
          <Card
            key={pregunta.title}
            className="border-black/10 shadow-lg shadow-black/5"
          >
            <CardHeader>
              <Badge className="w-fit rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]">
                Dignidad infantil
              </Badge>
              <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
                {pregunta.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-base text-muted-foreground">
              <p>{pregunta.body}</p>
            </CardContent>
          </Card>
        ))}

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader>
            <Badge className="w-fit rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]">
              Internet sano en casa
            </Badge>
            <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
              Internet sano en casa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base text-muted-foreground">
            <p>
              Otro de los aspectos que la Ley 679 de 2001 promulga, es el
              interés de proteger a los infantes de acceder a sitios con
              contenido para adultos (pornografía). Pese al crecimiento y
              difícil control de Internet en este sentido, existen métodos y
              herramientas que pueden filtrar contenidos no deseados y así
              proteger a los menores como configurar el navegador para filtrar
              contenidos (PDF requiere Adobe Acrobat).
            </p>
            <p>
              Programas de filtrado de contenido: Este tipo de software le
              permite completa funcionalidad durante un periodo de tiempo
              transcurrido (shareware) el cual usted puede utilizar bajo su
              vigilancia para su previa satisfacción. Tener en cuenta que las
              herramientas mencionadas son solo opciones en el mercado, puede
              encontrar algunas de pago como de uso libre, se aconseja indagar
              más sobre software de este tipo:
            </p>
            <ul className="space-y-2 text-base font-semibold text-black">
              {programasFiltrado.map((programa) => (
                <li key={programa} className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#ff6400]" />
                  {programa}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader>
            <Badge className="w-fit rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]">
              Dignidad infantil
            </Badge>
            <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
              ¿Dónde denunciar las páginas que tengan contenido infantil
              pornográfico?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base text-muted-foreground">
            {puntosDenuncia.map((punto) => (
              <div key={punto.title} className="space-y-3">
                <h3 className="text-lg font-semibold text-black">
                  {punto.title}
                </h3>
                <ul className="space-y-2">
                  {punto.items.map((item, index) => (
                    <li
                      key={`item-punto-denuncia-${index}`}
                      className="flex items-center gap-2"
                    >
                      <ArrowRight className="h-4 w-4 text-[#ff6400]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Separator className="bg-black/10" />
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-black">
                Otros sitios de denuncia
              </h3>
              <div className="grid gap-6 border-t border-black/10 pt-6">
                {otrosSitios.map((sitio, index) => (
                  <div
                    key={`sitio-otros-denuncia-${index}`}
                    className="space-y-3"
                  >
                    <h4 className="text-lg font-semibold text-black">
                      {sitio.title}
                    </h4>
                    <ul className="space-y-2">
                      {sitio.items.map((item, index) => (
                        <li
                          key={`item-sitio-otros-denuncia-${index}`}
                          className="flex items-center gap-2"
                        >
                          <ArrowRight className="h-4 w-4 text-[#ff6400]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Separator className="bg-black/10" />
                  </div>
                ))}
              </div>
            </div>
            <p className="pt-4 text-sm font-semibold uppercase text-black">
              Servicio brindado por proveedor.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
