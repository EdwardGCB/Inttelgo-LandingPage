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
import { ArrowRight, Shield, ShieldAlert } from "lucide-react";
import { externalLink } from "@/lib/utils";

const mitmParagraphs = [
  <>
    Man-in-the-Middle (MitM), que en español significa “hombre en el medio”, es
    un tipo de ataque destinado a interceptar, sin autorización, la comunicación
    entre dos dispositivos (hosts) conectados a una red. Este ataque le permite
    a un agente malintencionado manipular el tráfico interceptado de diferentes
    formas, ya sea para escuchar la comunicación y obtener información sensible,
    como credenciales de acceso, información financiera, etc., o para suplantar
    la identidad de alguna de las partes. Para que un ataque MitM funcione
    correctamente, el delincuente debe asegurarse que será el único punto de
    comunicación entre los dos dispositivos, es decir, el delincuente debe estar
    presente en la misma red que los hosts apuntados en el ataque para cambiar
    la{" "}
    {externalLink(
      "tabla de enrutamiento",
      "https://es.wikipedia.org/wiki/Tabla_de_enrutamiento"
    )}{" "}
    para cada uno de ellos.
  </>,
  <>
    Aunque alterar la tabla de enrutamiento es infinitamente más simple cuando
    se realiza en la misma red, técnicamente sería posible{" "}
    {externalLink(
      "secuestrar los routers",
      "https://www.welivesecurity.com/la-es/2019/12/16/guia-configurar-router-optimizar-seguridad-red-wi-fi/"
    )}{" "}
    de los proveedores de Internet y alterar arbitrariamente sus tablas de
    enrutamiento, pero la complejidad de este tipo de ataque es
    incomparablemente mayor. Por tanto, todos los ejemplos que citaré en este
    artículo estarán relacionados con el ataque desde dentro de la red.
  </>,
  <>
    Lectura recomendada:{" "}
    {externalLink(
      "Malware Plead distribuido mediante ataques de Man in the Middle a nivel de router",
      "https://www.welivesecurity.com/la-es/2019/05/15/malware-plead-distribuido-mediante-ataques-man-middle-router/"
    )}
  </>,
];

const executionAttackParagraphs = [
  "Como sucede en la mayoría de los ataques, incluso si el delincuente no tiene un profundo conocimiento sobre lo que va a ejecutar, podrá llevarlo a cabo, aunque sea de forma mecánica. Y en el caso de los ataques de Man-in-the-Middle no es diferente: siguiendo algunas instrucciones que se encuentran fácilmente en Internet, es posible reproducir este tipo de ataque. Por eso es tan importante tomar siempre medidas de protección.",
  "Para comprender cómo funciona el ataque, veamos la imagen a continuación. En la misma se puede apreciar la tabla de enrutamiento presente en la computadora de la víctima, aún sin cambios.",
];

const phishingParagraphs = [
  "En esta modalidad de fraude, el usuario malintencionado envía millones de mensajes falsos que parecen provenir de sitios Web reconocidos o de su confianza, como un banco o la empresa de su tarjeta de crédito. Dado que los mensajes y los sitios Web que envían estos usuarios parecen oficiales, logran engañar a muchas personas haciéndoles creer que son legítimos. La gente confiada normalmente responde a estas solicitudes de correo electrónico con sus números de tarjeta de crédito, contraseñas, información de cuentas u otros datos personales.",
  "Para que estos mensajes parezcan aún más reales, el estafador suele incluir un vínculo (link) falso que parece dirigir al sitio Web legítimo, pero en realidad lleva a un sitio falso o incluso a una ventana emergente que tiene exactamente el mismo aspecto que el sitio Web oficial. Estas copias se denominan “sitios Web piratas”. Una vez que el usuario está en uno de estos sitios Web, introduce información personal sin saber que se transmitirá directamente al delincuente, que la utilizará para realizar compras, solicitar una nueva tarjeta de crédito o robar su identidad.",
];
const phishingRecommendations = [
  "Nunca responda a solicitudes de información personal a través de correo electrónico. Si tiene alguna duda, póngase en contacto con la entidad que supuestamente le ha enviado el mensaje.",
  "Tener especial cuidado en correos que supuestamente han sido enviados por entidades financieras y compras por Internet, como eBay, PayPal, bancos, etc.",
  "Asegúrese que su PC cuente con las últimas actualizaciones de seguridad dadas por los fabricantes (Microsoft, Mac, etc.).",
  "Para visitar sitios web, introduzca directamente la dirección URL en la barra de direcciones.",
  "Asegúrese de que el sitio web utiliza cifrado.",
  "Si tiene instalados servidores web, asegúrese de que tanto el aplicativo como el sistema operativo cuenten con las últimas actualizaciones de seguridad dadas por los fabricantes correspondientes.",
  "Comunique los posibles delitos relacionados con su información personal a las autoridades competentes.",
];

const spamParagraphs = [
  "Se llama spam, correo basura a los mensajes no solicitados, habitualmente de tipo publicitario, enviados en cantidades masivas que perjudican de una u otra manera a los usuarios que reciben este correo. Aunque su difusión se puede hacerse por distintas vías, lo mas común es hacerlo vía correo electrónico.",
  <>
    Actualmente <span className="font-semibold text-[#ff6400]">INTTELGO</span>{" "}
    cuenta con una plataforma que protege a los usuarios de este tipo de
    correos.
  </>,
  "Normas básicas para evitar y reducir al mínimo el spam",
  "El spam es un problema que debe ser controlado desde diferentes frentes, tanto a nivel de usuarios como a nivel de los proveedores de Internet.",
  "A nivel de usuario, se pueden seguir estas recomendaciones para evitar ser inundado por correo spam:",
];

const spamRecommendations = [
  "Si no se reconoce un remitente de un correo, no abrir los archivos adjuntos del mensaje, incluso si usted tiene un software bloqueador de spam y/o filtro de aplicación ejecutándose en su PC. Los archivos adjuntos a menudo incluyen software o aplicaciones malintencionadas que pueden tener efectos muy negativos sobre su PC, desde borrar su información mas valiosa hasta capturar contraseñas, números de tarjetas de crédito, etc… sin que el usuario ni siquiera se entere. Estas aplicaciones no se pueden incluir en un mensaje de correo electrónico en texto plano, la cual es la razón por la que se empaquetan en los archivos adjuntos.",
  "Si recibe un correo spam, nunca haga clic en el vínculo Quitar spam, ya que lo que buscan los spammers es que el cliente verifique que esta dirección de correo está activa, añadiendo posiblemente su cuenta de correo a más y más listas de spam, lo cual ocasionará que usted reciba mayor cantidad de correo no deseado.",
  "Algunos programas que utilizan los spammers tratan de adivinar las cuentas de correo a las cuales enviar correo no deseado, por lo cual es recomendable utilizar cuentas que contengas números y letras para que no sean fácilmente ubicadas.",
  "Nunca dar click sobre enlaces (links) que se encuentren dentro de un mensaje de correo electrónico de un remitente desconocido. Probablemente pueda ser un caso de phishing para tratar de robar la identidad del usuario o puede activar un programa que silenciosamente descargue aplicaciones en su PC.",
  "En caso de que usted conozca al remitente, igual la recomendación es no dar click sobre enlaces (links) que se encuentren dentro del mensaje. Uno nunca puede estar seguro de que quien envía el mensaje es realmente quien dice ser, ya que los spammers pueden cambiar la cuenta remitente, suplantando la identidad de otra persona.",
  "Para acceder a un enlace (link) dentro del mensaje, se recomienda cerrar el mensaje, y visitar el sitio en cuestión, introduciendo manualmente la URL (por ejemplo, www.google.com) en su navegador de Internet. Es la única manera de estar seguro que la página a la cual se está accediendo es la real.",
  "Para tratar de evitar que su cuenta sea ingresada en listas de correo utilizadas por los spammers, se recomienda que el usuario preste cuidado a los sitios donde ingresa y que le solicita registrarse (mediante una cuenta de correo), ya que existen muchos sitios Web inescrupulosos que venden estas cuentas registradas a redes de spammers.",
  "Si tiene instalado servidores de correo, asegúrese que tanto el aplicativo como el sistema operativo cuenten con las últimas actualizaciones a nivel de seguridad dadas por los fabricantes correspondientes. En muchos casos, los servidores de correo, debido a configuraciones deficientes, permiten que cualquier persona, desde Internet, utilice estos servidores para enviar correos (conocido como Open Relay), afectando el servicio de correo del cliente y muy posiblemente será bloqueado en listas negras de Spam mantenidas a nivel mundial.",
];

const spamLookupLinks = [
  {
    url: "http://www.dnsstuff.com/",
    label: "dnsstuff.com",
    description: "Consulta general de reputación y DNS.",
  },
  {
    url: "http://200.118.2.73/varios/bloqueoIPs.asp",
    label: "Bloqueo IPs",
    description:
      "Portal para solicitar el desbloqueo cuando una IP del cliente ha sido reportada.",
  },
];

const spamFrequentSites = [
  {
    url: "https://www.aol.com",
    label: "www.aol.com",
    time: "Tiempo de desbloqueo aprox. 48 horas",
  },
  {
    url: "https://www.lashback.com",
    label: "www.lashback.com",
    time: "Tiempo de desbloqueo aprox. 1 hora",
  },
  {
    url: "https://www.uceprotect.net",
    label: "www.uceprotect.net",
    time: "Tiempo de desbloqueo aprox. 7 días",
  },
  {
    url: "https://www.spamcop.net",
    label: "www.spamcop.net",
    time: "Tiempo de desbloqueo aprox. 24 horas",
  },
  {
    url: "https://www.dsbl.org",
    label: "www.dsbl.org",
    time: "Tiempo de desbloqueo aprox. 7 días",
  },
  {
    url: "https://www.wpbl.info",
    label: "www.wpbl.info",
    time: "Tiempo de desbloqueo aprox. 1 hora",
  },
  {
    url: "https://www.moensted.dk",
    label: "www.moensted.dk",
    time: "Tiempo de desbloqueo aprox. 1 hora",
  },
  {
    url: "https://www.comcast.com",
    label: "www.comcast.com",
    time: "Tiempo de desbloqueo aprox. 48 horas",
  },
  {
    url: "http://www.abuso.cantv.net",
    label: "www.abuso.cantv.net",
    time: "Tiempo de desbloqueo aprox. 48 horas",
  },
  {
    url: "https://www.spamhaus.org",
    label: "www.spamhaus.org",
    time: "Tiempo de desbloqueo aprox. 24 horas",
  },
];

const virusRecommendations = [
  "Si no se reconoce un remitente de un correo, no abrir los archivos adjuntos del mensaje, incluso si se cuenta con antivirus.",
  "Evitar la instalación de software pirata o de baja calidad, especialmente aplicaciones descargadas mediante redes P2P.",
  "Asegurarse de que el equipo cuente con las últimas actualizaciones de seguridad, tanto del sistema operativo como de los aplicativos instalados.",
  "Instalar y mantener actualizado un software antivirus con las firmas más recientes proporcionadas por el fabricante.",
];

const mitmConsequencesParagraphs = [
  "Ahora que entendemos un poco sobre la estructura del ataque en sí, queda por ver qué pueden hacer los delincuentes cuando llevan a cabo un ataque Man-in-the-Middle.",
  <>
    En el ejemplo que mencioné, la captura de tráfico fue realizada por{" "}
    {externalLink("Ettercap", "https://www.ettercap-project.org/")} con el fin
    de analizar paquetes. Sin embargo, Ettercap no es la única solución que
    ayuda a crear ataques Man-in-the-Middle. Es posible desarrollar amenazas
    para realizar determinadas acciones dentro del tráfico interceptado o
    utilizar alguna de las soluciones ya creadas para realizar estas
    modificaciones. Una de las soluciones desarrolladas para este propósito fue{" "}
    {externalLink(
      "Man-in-the-Middle Framework",
      "https://github.com/byt3bl33d3r/MITMf"
    )}
    , o MITMf, que viene con varias funcionalidades instaladas por defecto.
    Algunas de estas funcionalidades permiten:
  </>,
];

const mitmConsequences = [
  "Realizar capturas de pantalla de lo que observa la víctima cada cierto tiempo.",
  "Insertar en la página a la que se accede código en JavaScript creado por el atacante",
  "Ejecutar procesos que intentan abrir tráfico encriptado HTTPS",
  <>
    Insertar un{" "}
    {externalLink(
      "keylogger",
      "https://www.welivesecurity.com/la-es/2021/03/04/que-es-keylogger-herramienta-para-espiar/"
    )}{" "}
    que capture todo lo que escribe la víctima.
  </>,
];

const mitmDefinitions = [
  <>
    <span className="font-semibold text-[#ff6400]">
      Siempre desconfíe de las redes Wi-Fi:
    </span>{" "}
    por definición, las redes Wi-Fi son más susceptibles a los ataques si
    alguien ha podido acceder a la red legítima de manera no autorizada o porque
    los actores maliciosos crean una red con el mismo nombre que la red legítima
    para engañar a los usuarios y que se conecten. Tenga siempre{" "}
    {externalLink(
      "cuidado al utilizar redes Wi-Fi públicas",
      "https://www.welivesecurity.com/la-es/2019/02/05/riesgos-asociados-redes-wi-fi-publicas/"
    )}
    . En caso de necesitar utilizarlas, evite compartir información importante y
    descargar archivos.
  </>,
  <>
    <span className="font-semibold text-[#ff6400]">
      Solo instale software de fuentes conocidas:
    </span>{" "}
    – muchas amenazas se esconden detrás de software o archivos que parecen
    inofensivos. Por eso es importante asegurarse de que el software que
    necesita descargar provenga de una fuente confiable para disminuir las
    posibilidades de que la descarga haya sido manipulada. Si un ataque
    Man-in-the-Middle ya está en marcha, es posible que los ciberdelincuentes
    puedan cambiar el archivo de destino que se descargará. Si este es el caso,
    el siguiente consejo le ayudará a identificar el proceso.
  </>,
  <>
    <span className="font-semibold text-[#ff6400]">Antivirus: </span> – esta es
    una recomendación presente en casi todas las publicaciones relacionadas a
    amenazas informáticas de WeLiveSecurity, por el simple hecho de que es una
    de las formas más eficientes de prevenir la mayoría de las amenazas.
    Mientras recopilaba imágenes para la elaboración de este artículo olvidé
    deshabilitar mi software de protección y me alertó sobre una amenaza
    potencial en la red e identificó un ataque de envenenamiento de caché ARP.
  </>,
];

const mitmAdditionalMeasures = [
  <>
    <span className="font-semibold text-[#ff6400]">Segregar redes:</span> sacar
    hosts del mismo dominio de colisión ayuda a evitar que se realicen ataques
    en toda la red a la vez.
  </>,
  <>
    <span className="font-semibold text-[#ff6400]">Firewall:</span> proteja
    estas redes con un firewall que tenga reglas adecuadas, evitando
    interacciones no deseadas.
  </>,
  <>
    <span className="font-semibold text-[#ff6400]">
      Configurar los routers:
    </span>{" "}
    muchos dispositivos de red tienen la capacidad de inspeccionar la tabla ARP
    para evitar ataques de envenenamiento, identificar si sus dispositivos
    tienen esta función y, si la tienen, habilitarla la red a la vez.
  </>,
];

function Seguridad() {
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
              <Shield className="h-10 w-10" />
            </div>
            <CardTitle className="text-4xl font-extrabold uppercase tracking-tight text-black sm:text-5xl">
              Seguridad
            </CardTitle>
            <CardDescription className="max-w-3xl text-base text-muted-foreground">
              Información y recomendaciones para proteger tus comunicaciones
              frente a ataques comunes en Internet.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="space-y-3">
            <Badge className="w-fit rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]">
              Ataque "Man-in-the-Middle"
            </Badge>
            <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
              Ataque “Man-in-the-Middle”
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-muted-foreground">
            {mitmParagraphs.map((paragraph, index) => (
              <p key={`mitm-paragraph-${index}`}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
              Ejecución del ataque
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-muted-foreground">
            {executionAttackParagraphs.map((paragraph, index) => (
              <p key={`execution-attack-paragraph-${index}`}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="space-y-2">
            <Badge className="w-fit rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]">
              Phishing
            </Badge>
            <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
              Phishing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base text-muted-foreground">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black">Definición</h3>
              <p>
                El “phishing” es una modalidad de estafa diseñada con la
                finalidad de robarle al usuario su identidad. El delito consiste
                en obtener información tal como números de tarjetas de crédito,
                contraseñas, información de cuentas u otros datos personales por
                medio de engaños. Este tipo de fraude se recibe habitualmente a
                través de mensajes de correo electrónico o de ventanas
                emergentes.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black">
                Cómo funciona
              </h3>
              {phishingParagraphs.map((paragraph, index) => (
                <p key={`phishing-paragraph-${index}`}>{paragraph}</p>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black">
                Cómo protegerse
              </h3>
              <p>
                Este tipo de fraude debe contenerse a través del ISP y vía
                usuario.
              </p>
              <p>
                El usuario debe seguir estas recomendaciones para evitar que sea
                víctima de robo de su identidad:
              </p>
              <ul className="space-y-2">
                {phishingRecommendations.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p>
              A nivel del ISP, actualmente{" "}
              <span className="font-semibold text-[#ff6400]">INTTELGO</span>
              implementa filtros anti-spam que ayudan a proteger a los usuarios
              de los phishers, reduciendo el número de correos electrónicos
              maliciosos recibidos por el usuario.
            </p>
          </CardContent>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="space-y-2">
            <Badge className="w-fit rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]">
              Spam
            </Badge>
            <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
              Spam
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base text-muted-foreground">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black">Definición</h3>
              {spamParagraphs.map((paragraph, index) => (
                <p key={`spam-paragraph-${index}`}>{paragraph}</p>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black">
                Normas básicas para evitar y reducir al mínimo el spam
              </h3>
              <ul className="space-y-2">
                {spamRecommendations.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="bg-black/10" />
            <div className="flex items-start gap-2 rounded-2xl bg-[#fff4ec] p-5 text-sm text-[#a13d00]">
              <ShieldAlert className="mt-1 h-5 w-5 flex-shrink-0 text-[#ff6400]" />
              <p>
                En caso que ustedd como cliente tenga problemas en el envío de
                correos, para verificar que su IP no se encuentra reportada en
                listas negras de spam, puede revisar los siguientes enlaces para
                realizar la consulta:
              </p>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <ul className="space-y-2">
                {spamLookupLinks.map((link) => (
                  <li
                    key={link.url}
                    className="flex flex-col sm:flex-row sm:items-center sm:gap-3"
                  >
                    <span>{link.description}</span>
                    {externalLink(link.label, link.url)}
                  </li>
                ))}
              </ul>
              <p>
                Para que pueda ser efectivo este desbloqueo, el cliente deberá
                tomar las medidas correspondientes para evitar que se continúe
                enviando correo spam.
              </p>
              <p>
                Hay que tener en cuenta que el tiempo de desbloqueo depende del
                sitio en el cual ha sido reportado una IP. Entre los sitios más
                frecuentes, están:
              </p>
              <ul className="space-y-2">
                {spamFrequentSites.map((site) => (
                  <li
                    key={site.url}
                    className="flex flex-col sm:flex-row sm:items-center sm:gap-3"
                  >
                    {externalLink(site.label, site.url)}
                    <span className="text-muted-foreground">{site.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="space-y-2">
            <Badge className="w-fit rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]">
              Virus
            </Badge>
            <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
              Virus
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-base text-muted-foreground">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black">Definición</h3>
              <p>
                Un virus informático es un programa que se copia automáticamente
                y que tiene por objeto alterar el normal funcionamiento del PC,
                sin el permiso o el conocimiento del usuario. Los virus pueden
                destruir, de manera intencionada, los datos almacenados en un PC
                aunque también existen otros más “benignos”, que solo se
                caracterizan por ser molestos.
              </p>
              <p>
                Los virus informáticos tienen, básicamente, la función de
                propagarse, replicándose, pero algunos contienen además una
                carga dañina (payload) con distintos objetivos, desde una simple
                broma hasta realizar daños importantes en los sistemas, o
                bloquear las redes informáticas generando tráfico inútil.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-black">
                Cómo protegerse
              </h3>
              <p>
                Similar al spam, los virus son un problema que debe ser
                controlado desde diferentes frentes, tanto a nivel de usuarios
                como a nivel de los proveedores de Internet.
              </p>
              <p>
                A nivel de usuario, se pueden seguir estas recomendaciones para
                evitar ser víctima de los efectos de un virus informático:
              </p>
              <ul className="space-y-2">
                {virusRecommendations.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p>
                A nivel de ISP,{" "}
                <span className="font-semibold text-[#ff6400]">INTTELGO</span>{" "}
                cuenta actualmente con equipos especializados en la detección y
                filtrado de correos con virus, mediante filtros de tipo
                heurístico, firmas de virus reconocidos y adicional cuenta con
                filtros de tipo preventivo, que aunque a nivel público no se
                halla liberado una firma para contener una nueva amenaza, el
                sistema coloca en cuarentena este tipo de tráfico, hasta
                determinar si el tráfico es legal o hasta que se tenga la firma
                correspondiente a la propagación del nuevo virus o gusano. Todos
                los correos que los usuarios reciben y envían son filtrados por
                esta herramienta.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="space-y-2">
            <Badge className="w-fit rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]">
              Ataque MitM
            </Badge>
            <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
              Consecuencias de un ataque de Man-in-the-Middle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-muted-foreground">
            {mitmConsequencesParagraphs.map((paragraph, index) => (
              <p key={`mitm-consequences-paragraph-${index}`}>{paragraph}</p>
            ))}
            <ul className="space-y-2">
              {mitmConsequences.map((item, index) => (
                <li
                  key={`mitm-consequence-${index}`}
                  className="flex items-start gap-2"
                >
                  <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p>
              Con esto, las opciones de ataque son prácticamente ilimitadas, y
              aún es posible utilizar el ataque para dirigir el tráfico a otros
              frameworks con aún más funcionalidades, como, por ejemplo, BeEF.
            </p>
            <p>
              Además del enfoque MitM más tradicional que menciono en esta
              publicación, los delincuentes usan este concepto de interceptar
              las acciones de las víctimas en varios otros tipos de ataques,
              como la alteración de la memoria cuando la víctima usa el
              portapapeles (al copiar y pegar algo), ataques de
              Man-in-the-Browser (que significa hombre en el navegador) cuando
              el ciberdelincuente modifica información transmitida directamente
              por el navegador, por ejemplo, cuando se realiza una compra. Todos
              estos tipos de ataques tienen un impacto significativo en las
              víctimas y la mayoría de ellos no muestran signos de que la
              víctima esté siendo atacada en ese momento, lo que hace que las
              medidas de protección frente a este tipo de amenazas sean aún más
              necesarias.
            </p>
          </CardContent>
        </Card>

        <Card className="border-black/10 shadow-lg shadow-black/5">
          <CardHeader className="space-y-2">
            <Badge className="w-fit rounded-full bg-[#fff4ec] px-4 py-1 text-sm font-semibold text-[#ff6400]">
              Protección MitM
            </Badge>
            <CardTitle className="text-3xl font-extrabold uppercase text-[#ff6400]">
              Cómo protegerse de un ataque de Man-in-the-Middle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-muted-foreground">
            <ul className="space-y-2">
              {mitmDefinitions.map((item, index) => (
                <li
                  key={`mitm-definition-${index}`}
                  className="flex items-start gap-2"
                >
                  <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
                  <p>{item}</p>
                </li>
              ))}
            </ul>
            <p>
              Tenga siempre en su dispositivo una solución antivirus
              correctamente instalada, actualizada y configurada para detener
              las amenazas que llegan a través de archivos o redes.
            </p>
            <p>
              Si le preocupan los ataques MitM en su entorno de red corporativa,
              puede tomar algunas medidas adicionales para prevenirlos:
            </p>
            <ul className="space-y-2">
              {mitmAdditionalMeasures.map((item, index) => (
                <li
                  key={`mitm-additional-measure-${index}`}
                  className="flex items-start gap-2"
                >
                  <ArrowRight className="mt-1 h-4 w-4 text-[#ff6400] flex-shrink-0" />
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Seguridad;
