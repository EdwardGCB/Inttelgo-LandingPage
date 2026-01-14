import Menu from "@/Layouts/Menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";

const sections = [
  {
    title: "1. ORGANIZADOR",
    content: (
      <p className="text-base text-muted-foreground">
        La Beca es organizada por{" "}
        <span className="font-semibold text-[#ff6400]">Inttel Go</span>, empresa
        prestadora de servicios de telecomunicaciones, quien será la responsable
        de la gestión, selección, asignación de la beca y pagos del mismo.
      </p>
    ),
  },
  {
    title: "2. OBJETIVO DE LA BECA",
    content: (
      <p className="text-base text-muted-foreground">
        Apoyar a estudiantes con educación media para que puedan iniciar y
        culminar sus procesos formativos de educación superior en modalidad
        presencial (técnica, tecnológica o profesional), que cumplan con los
        requisitos establecidos por{" "}
        <span className="font-semibold text-[#ff6400]">Inttel Go</span>,
        promoviendo el acceso equitativo a oportunidades educativas y
        contribuyendo a su desarrollo académico, personal y social.
      </p>
    ),
  },
  {
    title: "3. COBERTURA Y BENEFICIO",
    content: (
      <div className="space-y-4 text-base text-muted-foreground">
        <p>
          La Beca{" "}
          <span className="font-semibold text-[#ff6400]">Inttel Go 2026</span> –
          Educación Superior (Beca Completa) cubrirá el valor total de los
          semestres académicos del programa de educación superior presencial al
          que el beneficiario haya sido admitido, de acuerdo con las condiciones
          definidas por{" "}
          <span className="font-semibold text-[#ff6400]">Inttel Go</span>.
        </p>
        <p>La beca podrá incluir:</p>
        <ul className="space-y-2 ml-6 list-disc">
          <li>
            Pago total del valor de los semestres académicos durante el periodo
            establecido.
          </li>
          <li>Acompañamiento institucional durante la vigencia de la beca.</li>
          <li>
            Beneficios complementarios definidos por{" "}
            <span className="font-semibold text-[#ff6400]">Inttel Go</span>, si
            así se determina.
          </li>
        </ul>
        <p>
          La duración de la beca estará sujeta al plan académico del programa y
          al cumplimiento de los requisitos establecidos en los presentes
          términos y condiciones.
        </p>
        <div className="rounded-2xl border border-[#ff6400]/40 bg-[#fff4ec] p-5">
          <p className="font-medium text-[#a13d00]">
            <strong>Parágrafo:</strong> La beca aplica exclusivamente para
            programas de estudio en modalidad presencial. No se cubrirán
            programas virtuales, a distancia o semipresenciales.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "4. REQUISITOS PARA PARTICIPAR",
    content: (
      <div className="space-y-4 text-base text-muted-foreground">
        <p>
          Podrán postularse estudiantes que cumplan con los siguientes
          requisitos:
        </p>
        <ul className="space-y-3">
          {[
            "Residir en la zona de cobertura de Inttel Go.",
            "Diligenciar correctamente el formulario de inscripción.",
            "Presentar la documentación solicitada, como documento de identidad, constancia de matrícula vigente y otros soportes académicos.",
            "En caso de ser menor de edad, contar con autorización escrita del padre, madre o representante legal.",
            "No registrar deudas pendientes con Inttel Go",
          ].map((requisito, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-[#ff6400] flex-shrink-0" />
              <span>{requisito}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    title: "5. PROCESO DE INSCRIPCIÓN",
    content: (
      <div className="space-y-3 text-base text-muted-foreground">
        <div className="flex items-start gap-3">
          <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
          <p>La inscripción será gratuita.</p>
        </div>
        <div className="flex items-start gap-3">
          <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
          <p>
            Se realizará dentro de las fechas establecidas y comunicadas por{" "}
            <span className="font-semibold text-[#ff6400]">Inttel Go</span>.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
          <p>
            La información suministrada deberá ser veraz; cualquier
            inconsistencia podrá causar la descalificación.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "6. SELECCIÓN DE BENEFICIARIOS",
    content: (
      <div className="space-y-3 text-base text-muted-foreground">
        <div className="flex items-start gap-3">
          <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
          <p>
            La selección será realizada por un comité designado por{" "}
            <span className="font-semibold text-[#ff6400]">Inttel Go</span>.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
          <p>
            Se evaluarán criterios como necesidad, mérito, impacto social y
            cumplimiento de requisitos.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
          <p>La decisión del comité será definitiva e inapelable.</p>
        </div>
      </div>
    ),
  },
  {
    title: "7. OBLIGACIONES DEL BENEFICIARIO",
    content: (
      <div className="space-y-4 text-base text-muted-foreground">
        <p>
          El beneficiario de la Beca{" "}
          <span className="font-semibold text-[#ff6400]">Inttel Go 2026</span> –
          Educación Superior (Beca Completa) se compromete a:
        </p>
        <ul className="space-y-3">
          {[
            "Mantener su condición de estudiante activo y matriculado durante cada semestre académico.",
            "Aprobar el número mínimo de créditos o asignaturas exigidos por la institución educativa.",
            "Mantener un rendimiento académico adecuado, conforme a los criterios que establezca Inttel Go.",
            "Utilizar la beca exclusivamente para fines académicos.",
            "Presentar certificados de notas y constancia de matrícula cuando sean requeridos.",
            "Mantener un comportamiento ético y respetuoso acorde con los valores de Inttel Go.",
            "Informar oportunamente cualquier situación académica o personal que pueda afectar la continuidad de la beca.",
          ].map((obligacion, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-[#ff6400] flex-shrink-0" />
              <span>{obligacion}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    title: "8. CAUSALES DE PÉRDIDA DE LA BECA",
    content: (
      <div className="space-y-4 text-base text-muted-foreground">
        <p>La beca podrá ser suspendida o cancelada en los siguientes casos:</p>
        <ul className="space-y-3">
          {[
            "Pérdida de una o más materias, asignaturas o créditos académicos.",
            "Bajo rendimiento académico, conforme a los criterios mínimos establecidos por Inttel Go.",
            "Pérdida de la condición de estudiante activo o cancelación del semestre.",
            "Abandono voluntario del programa académico.",
            "Cambio de modalidad de estudio a virtual, a distancia o semipresencial.",
            "Presentación de información falsa o documentación alterada.",
            "Uso indebido de los recursos otorgados.",
            "Incumplimiento de los presentes términos y condiciones.",
          ].map((causal, index) => (
            <li key={index} className="flex items-start gap-3">
              <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
              <span>{causal}</span>
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-[#ff6400]/40 bg-[#fff4ec] p-5">
          <p className="font-medium text-[#a13d00]">
            <strong>Parágrafo:</strong> El beneficiario deberá contar con
            disponibilidad para asistir de manera presencial a la oficina de{" "}
            <span className="font-semibold text-[#ff6400]">Inttel Go</span>{" "}
            cuando sea requerido. La no asistencia injustificada podrá ser
            causal de suspensión o pérdida del beneficio.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "9. AUTORIZACIÓN DE USO DE IMAGEN Y DATOS",
    content: (
      <div className="space-y-3 text-base text-muted-foreground">
        <p>
          Los participantes autorizan a{" "}
          <span className="font-semibold text-[#ff6400]">Inttel Go</span> a:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 text-[#ff6400] flex-shrink-0" />
            <span>
              Tratar sus datos personales conforme a la normativa vigente.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-5 w-5 text-[#ff6400] flex-shrink-0" />
            <span>
              Utilizar su nombre e imagen con fines informativos y promocionales
              de la beca, sin compensación adicional.
            </span>
          </li>
        </ul>
        <p>
          En el caso de menores de edad, esta autorización deberá ser otorgada
          por su representante legal.
        </p>
      </div>
    ),
  },
  {
    title: "10. PROTECCIÓN DE DATOS PERSONALES",
    content: (
      <p className="text-base text-muted-foreground">
        <span className="font-semibold text-[#ff6400]">Inttel Go</span>{" "}
        garantizará el tratamiento adecuado de los datos personales conforme a
        la Ley de Protección de Datos vigente en Colombia.
      </p>
    ),
  },
  {
    title: "11. MODIFICACIONES",
    content: (
      <p className="text-base text-muted-foreground">
        <span className="font-semibold text-[#ff6400]">Inttel Go</span> se
        reserva el derecho de modificar estos términos y condiciones, así como
        de suspender o cancelar la Beca{" "}
        <span className="font-semibold text-[#ff6400]">Inttel Go 2026</span>,
        informándolo oportunamente.
      </p>
    ),
  },
  {
    title: "12. ACEPTACIÓN",
    content: (
      <div className="space-y-4 text-base text-muted-foreground">
        <p>
          La participación en la Beca{" "}
          <span className="font-semibold text-[#ff6400]">Inttel Go 2026</span>{" "}
          implica el conocimiento y aceptación total de los presentes términos y
          condiciones.
        </p>
      </div>
    ),
  },
];

export default function TerminosBecaPage() {
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
              <GraduationCap className="h-10 w-10" />
            </div>
            <CardTitle className="text-4xl font-extrabold uppercase tracking-tight text-black sm:text-5xl">
              Términos y condiciones
            </CardTitle>
            <CardDescription className="max-w-3xl text-base text-muted-foreground">
              <span className="font-semibold text-[#ff6400]">
                BECA INTTEL GO 2026
              </span>{" "}
              (Dirigida a clientes de Inttel Go SAS)
            </CardDescription>
            <p className="max-w-3xl text-base text-muted-foreground mt-4">
              La Beca{" "}
              <span className="font-semibold text-[#ff6400]">
                Inttel Go 2026
              </span>{" "}
              es una iniciativa de responsabilidad social de{" "}
              <span className="font-semibold text-[#ff6400]">Inttel Go</span>{" "}
              que busca apoyar el acceso a la conectividad y/o formación
              académica de la comunidad. Al postularse, los participantes
              aceptan íntegramente los presentes términos y condiciones.
            </p>
          </CardHeader>
        </Card>

        <div className="grid gap-6">
          {sections.map(({ title, content }) => (
            <Card
              key={title}
              className="border-black/10 shadow-lg shadow-black/5"
            >
              <CardHeader className="flex items-center gap-4">
                <CardTitle className="text-2xl font-semibold text-black mt-2">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>{content}</CardContent>
            </Card>
          ))}
          <div className="rounded-2xl border border-[#ff6400]/40 bg-[#fff4ec] p-5 text-center">
            <p className="font-semibold text-lg text-[#ff6400]">
              Inttel Go – Conectamos oportunidades donde otros no llegan
            </p>
          </div>
        </div>

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
