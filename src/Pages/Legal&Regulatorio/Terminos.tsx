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
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";

const terms = [
  "El contenido de las páginas de este sitio web es solo para su información y uso general. Está sujeto a cambios sin previo aviso.",
  "Ni nosotros ni terceros proporcionamos ninguna garantía sobre la precisión, actualidad, rendimiento, integridad o idoneidad de la información y materiales encontrados u ofrecidos en este sitio web para ningún propósito en particular. Acepta que dicha información y materiales pueden contener inexactitudes o errores, y excluimos expresamente nuestra responsabilidad por tales inexactitudes o errores en la máxima medida permitida por la ley.",
  "Su uso de cualquier información o material en este sitio web es completamente bajo su propio riesgo, por lo que no seremos responsables. Será su responsabilidad asegurarse de que cualquier producto, servicio o información disponible a través de este sitio web cumpla con sus requisitos específicos.",
  "Este sitio web contiene material que es propiedad nuestra o está licenciado a nosotros. Este material incluye, pero no se limita a, el diseño, la disposición, la apariencia y los gráficos. La reproducción está prohibida, salvo en conformidad con el aviso de derechos de autor, que forma parte de estos términos y condiciones.",
  "Todas las marcas registradas reproducidas en este sitio web, que no son propiedad del operador o no están licenciadas a él, son reconocidas en el sitio web.",
  "El uso no autorizado de este sitio web puede dar lugar a una reclamación por daños y/o ser un delito penal.",
  "De vez en cuando, este sitio web puede incluir enlaces a otros sitios web. Estos enlaces se proporcionan para su conveniencia y para ofrecer información adicional. No significan que respaldemos el(los) sitio(s) web. No tenemos responsabilidad por el contenido de los sitios web enlazados.",
  <>
    No puede crear un enlace a este sitio web desde otro sitio web o documento
    sin el consentimiento previo por escrito de{" "}
    <span className="font-semibold text-[#ff6400]">INTTELGO S.A.S.</span>.
  </>,
];

export default function Terminos() {
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
              <FileText className="h-10 w-10" />
            </div>
            <CardTitle className="text-4xl font-extrabold uppercase tracking-tight text-black sm:text-5xl">
              Términos y condiciones
            </CardTitle>
            <CardDescription className="max-w-3xl text-base text-muted-foreground">
              Bienvenido a{" "}
              <span className="font-semibold text-[#ff6400]">
                INTTELGO S.A.S.
              </span>{" "}
              Si continúa navegando y utilizando este sitio web, acepta cumplir
              con los siguientes términos y condiciones de uso, que junto con
              nuestra política de privacidad regulan la relación de{" "}
              <span className="font-semibold text-[#ff6400]">
                INTTELGO S.A.S.
              </span>{" "}
              con usted en relación a este sitio web.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-black">
              Definiciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-muted-foreground">
            <p>
              El término{" "}
              <span className="font-semibold text-[#ff6400]">
                INTTELGO S.A.S.
              </span>{" "}
              o “nosotros” se refiere al propietario del sitio web. El término
              “usted” se refiere al usuario o visitante de nuestro sitio web. El
              uso de este sitio web está sujeto a los siguientes términos de
              uso:
            </p>
          </CardContent>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-2xl font-semibold text-black">
              Condiciones de uso
            </CardTitle>
            <Badge
              variant="secondary"
              className="rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]"
            >
              Obligatorio para usuarios
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-base text-muted-foreground">
            {terms.map((term, index) => (
              <div key={`term-${index}`} className="flex items-start gap-3">
                <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
                <p>{term}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Separator className="bg-black/10" />
        <Button
          variant="link"
          className="self-start p-0 text-sm font-semibold text-[#ff6400] hover:text-[#d95300]"
          asChild
        >
          <a href="mailto:info@inttelgo.com">¿Tienes dudas? Contáctanos</a>
        </Button>
      </main>
    </div>
  );
}
