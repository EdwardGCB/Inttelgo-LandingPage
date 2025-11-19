import Menu from "@/Layouts/Menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lock, Cookie, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { externalLink } from "@/lib/utils";

const sections = [
  {
    title: "Archivos de registro",
    icon: Globe2,
    paragraphs: [
      "Como muchos otros sitios web, INTTELGO S.A.S. usa archivos de registro. Esta información incluye direcciones IP, tipo de navegador, proveedor de Internet, fecha y hora, páginas que se visitan y número de clics. Esto nos ayuda a analizar tendencias, administrar el sitio y recopilar información demográfica. Las direcciones IP y otra información no están vinculadas a datos personales.",
    ],
  },
  {
    title: "Cookies",
    icon: Cookie,
    paragraphs: [
      <>
        <span className="font-semibold text-[#ff6400]">INTTELGO S.A.S.</span>{" "}
        usa cookies para guardar información sobre las preferencias de los
        visitantes, registrar qué páginas visita el usuario y personalizar el
        contenido según el tipo de navegador.
      </>,
    ],
  },
  {
    title: "Cookies DART de Google",
    icon: Cookie,
    paragraphs: [
      <>
        Google, como proveedor externo, usa cookies para mostrar anuncios en{" "}
        <span className="font-semibold text-[#ff6400]">INTTELGO S.A.S.</span>.
        La cookie DART permite a Google mostrar anuncios basados en las visitas
        a <span className="font-semibold text-[#ff6400]">INTTELGO S.A.S.</span>{" "}
        y otros sitios. Los usuarios pueden optar por no usar la cookie DART
        visitando la política de privacidad de Google en{" "}
        {externalLink(
          "https://www.google.com/policies/privacy/",
          "https://www.google.com/policies/privacy/"
        )}
      </>,
      "Los servidores de anuncios de terceros usan tecnología para enviar anuncios directamente a su navegador. Reciben automáticamente su dirección IP. También pueden usar otras tecnologías, como cookies o JavaScript, para medir la efectividad de sus anuncios o personalizar el contenido publicitario que ve.",
      <>
        <span className="font-semibold text-[#ff6400]">INTTELGO S.A.S.</span>
        no tiene acceso ni control sobre estas cookies usadas por anunciantes
        externos. Debe consultar las políticas de privacidad de estas compañías
        para obtener más información sobre sus prácticas. La política de
        privacidad de{" "}
        <span className="font-semibold text-[#ff6400]">INTTELGO S.A.S.</span> no
        se aplica a otros anunciantes o sitios web.
      </>,
      "Si desea desactivar las cookies, puede hacerlo a través de las opciones de su navegador. Más información sobre cómo gestionar cookies se puede encontrar en los sitios web del navegador.",
    ],
  },
];

export default function Privacidad() {
  return (
    <div className="bg-[#f7f8fb]">
      <Menu
        className={"text-black hover:text-black/80"}
        textColor="text-black hover:text-black/80"
        detailsColor=""
        lineColor="bg-black/50"
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 md:px-10 lg:px-0">
        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="flex flex-col items-center gap-4 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-black text-white">
              <Lock className="h-10 w-10" />
            </div>
            <CardTitle className="text-4xl font-extrabold uppercase tracking-tight text-black sm:text-5xl">
              Políticas de privacidad
            </CardTitle>
            <CardDescription className="max-w-2xl text-base text-muted-foreground">
              En{" "}
              <span className="font-semibold text-[#ff6400]">
                INTTELGO S.A.S.
              </span>
              , la privacidad de nuestros visitantes es muy importante para
              nosotros. Este documento explica qué tipo de información personal
              se recibe y se recopila en{" "}
              <span className="font-semibold text-[#ff6400]">
                INTTELGO S.A.S.
              </span>{" "}
              y cómo se utiliza.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid gap-6">
          {sections.map(({ title, icon: Icon, paragraphs }) => (
            <Card
              key={title}
              className="border-black/10 shadow-lg shadow-black/5"
            >
              <CardHeader className="flex items-center gap-4">
                <div className="mt-1 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff4ec]">
                  <Icon className="h-6 w-6 text-[#ff6400]" />
                </div>
                <div>
                  <Badge className="w-fit rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]">
                    {title}
                  </Badge>
                  <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
                    {title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-base text-muted-foreground">
                {paragraphs.map((text, index) => (
                  <p key={`paragraph-${index}`}>{text}</p>
                ))}
                {title === "Cookies DART de Google" && (
                  <Button
                    variant="link"
                    className="p-0 text-[#ff6400] hover:text-[#d95300]"
                    asChild
                  >
                    <a
                      href="https://www.google.com/policies/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Política de privacidad de Google
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="bg-black/10" />
        <p className="text-sm text-muted-foreground">
          Última actualización: {new Date().getFullYear()}
        </p>
      </main>
    </div>
  );
}
