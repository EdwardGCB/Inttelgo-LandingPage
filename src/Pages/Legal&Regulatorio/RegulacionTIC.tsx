import Menu from "@/Layouts/Menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { externalLink } from "@/lib/utils";

const regulaciones = [
  {
    texto: "Ley 679 de 2001",
    url: "https://www.suin-juriscol.gov.co/viewDocument.asp?ruta=Leyes/1609082",
  },
  {
    texto: "Acuerdo 011 de 2006",
    url: "https://normograma.supersociedades.gov.co/normograma/docs/acuerdo_crc_0011_2006.htm",
  },
  {
    texto: "Artículo 16 ley 1266 de 2008",
    url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=33336",
  },
  {
    texto: "Decreto 90 de 18 enero 2018",
    url: "https://www.funcionpublica.gov.co/eva/gestormormativo/norma.php?i=85192",
  },
  {
    texto: "Solicitudes habeas data",
    url: "https://www.sic.gov.co/habeas-data",
  },
  {
    texto: "Resolución 5299 de 2018",
    url: "https://normograma.supersalud.gov.co/normograma/docs/resolucion_crc_5299_2018.htm",
  },
  {
    texto: "Resolución 6890 de 2022",
    url: "https://normograma.supersalud.gov.co/normograma/docs/resolucion_crc_6890_2022.htm",
  },
  {
    texto: "Resolución 5321 de 2018",
    url: "https://normograma.supersalud.gov.co/normograma/docs/resolucion_crc_5321_2018.htm",
  },
  {
    texto: "Resolución 5300 de 2018",
    url: "https://normograma.supersalud.gov.co/normograma/docs/resolucion_crc_5300_2018.htm",
  },
  {
    texto: "Resolución 5337 de 2018",
    url: "https://normograma.supersalud.gov.co/normograma/docs/resolucion_crc_5337_2018.htm",
  },
  {
    texto: "Resolución 5050 de 2016",
    url: "https://normograma.supersalud.gov.co/normograma/docs/resolucion_crc_5050_2016.htm",
  },
  {
    texto: "Resolución 6333 de 2021",
    url: "https://normograma.supersalud.gov.co/normograma/docs/resolucion_crc_6333_2021.htm",
  },
  {
    texto: "Resolución 5344 de 2018",
    url: "https://normograma.supersalud.gov.co/normograma/docs/resolucion_crc_5344_2018.htm",
  },
  {
    texto: "Resolución 5322 de 2018",
    url: "https://normograma.supersalud.gov.co/normograma/docs/resolucion_crc_5322_2018.htm",
  },
  {
    texto: "Resolución 5397 de 2018",
    url: "https://normograma.supersalud.gov.co/normograma/docs/resolucion_crc_5397_2018.htm",
  },
  {
    texto: "Resolución 5930 de 2020",
    url: "https://normograma.supersalud.gov.co/normograma/docs/resolucion_crc_5930_2020.htm",
  },
  {
    texto: "Artículo 6 ley 1266 de 2008",
    url: "https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=33336",
  },
];

export default function RegulacionTIC() {
  return (
    <div className="bg-[#f7f8fb]">
      <Menu
        className={"text-black hover:text-black/80"}
        textColor="text-black hover:text-black/80"
        detailsColor=""
        lineColor="bg-black/50"
      />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:px-6 md:px-10 lg:px-0">
        <Card className="border-black/10 bg-white shadow-lg shadow-black/5">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-extrabold uppercase tracking-tight text-black sm:text-5xl">
              Regulación sector TIC
            </CardTitle>
          </CardHeader>
          <CardContent className="mx-10">
            <div className="grid gap-6 text-base text-muted-foreground sm:grid-cols-2">
              <ul className="space-y-3">
                {regulaciones
                  .slice(0, Math.ceil(regulaciones.length / 2))
                  .map(({ texto, url }) => (
                    <li key={url} className="flex items-start gap-2">
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#ff6400]" />
                      {externalLink(texto, url)}
                    </li>
                  ))}
              </ul>
              <ul className="space-y-3">
                {regulaciones
                  .slice(Math.ceil(regulaciones.length / 2))
                  .map(({ texto, url }) => (
                    <li key={url} className="flex items-start gap-2">
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#ff6400]" />
                      {externalLink(texto, url)}
                    </li>
                  ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
