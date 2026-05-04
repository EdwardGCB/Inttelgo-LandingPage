import SEO from "@/components/SEO";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import LightRays from "@/components/ui/LightRays";
import Menu from "@/Layouts/Menu";
import { cn } from "@/lib/utils";
import { Suspense, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GamesList from "@/components/Views/GamesList";
import GroupsList from "@/components/Views/GroupsList";
import ClasifiesList from "@/components/Views/ClasifiesList";
import ExperienceService from "@/services/ExperienceService";
import { UserProvider, useUser } from "@/contexts/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, LogOut, UserCheck, ShieldAlert, Info, MousePointerClick } from "lucide-react";
import UserPuntuation from "@/components/Views/UserPuntuation";
import Scores from "@/components/Views/Scores";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UserPrediction {
    id: string;
    match: number | string | { id?: number | string };
    homeScore: number;
    awayScore: number;
    puntuation: number;
}

function RulesDialog() {
    const [showRules, setShowRules] = useState(true);
    const rules = [
        {
            title: "Participantes habilitados",
            items: [
                { description: "Podrán participar únicamente los titulares activos del servicio." },
                { description: "La participación se validará ingresando el número de identificación del titular." },
                { description: "Cada titular podrá participar con un solo registro." },
                { description: "No se permiten registros duplicados ni participación de terceros no titulares." }
            ],
        },
        {
            title: "Registro y acceso",
            items: [
                {
                    description: "El ingreso a la plataforma se realizará mediante:",
                    subItems: [
                        "Número de identificación del titular del servicio."
                    ]
                },
                {
                    description: "Al ingresar, el participante podrá:",
                    subItems: [
                        "Ver los partidos disponibles del día en curso y del día siguiente.",
                        "Registrar su pronóstico de marcador para cada partido habilitado."
                    ]
                },
            ],
        },
        {
            title: "Pronósticos",
            items: [
                {
                    description: "Cada participante deberá ingresar:",
                    subItems: [
                        "El marcador exacto del partido (ejemplo: 2–1)."
                    ]
                },
                { description: "Los pronósticos solo podrán realizarse antes del cierre automático del partido." },
                { description: "Una vez enviado el pronóstico, no podrá modificarse" },
            ],
        }
    ]
    const titleUnderlineClass =
        "h-0.5 w-full bg-gradient-to-r from-transparent via-[#FF9900] via-50% to-transparent";

    return (
        <Dialog open={showRules} onOpenChange={setShowRules}>
            <DialogContent
                className={cn(
                    "flex max-h-[90vh] min-h-0 flex-col gap-0 overflow-hidden bg-black p-6 text-white border-white/15 sm:max-w-lg",
                    "[&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:ring-offset-black"
                )}
            >
                <DialogHeader className="shrink-0 space-y-0 pb-2 text-center sm:text-center">
                    <div className="mx-auto inline-flex max-w-full flex-col items-center">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                            Reglas
                        </DialogTitle>
                        <div className={cn("mt-4", titleUnderlineClass)} aria-hidden />
                    </div>
                </DialogHeader>
                <div className="mt-2 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1 [-webkit-overflow-scrolling:touch]">
                    {rules.map((rule, ruleIndex) => {
                        const { title, items } = rule;
                        return (
                            <div
                                key={`rule-section-${ruleIndex + 1}`}
                                className="space-y-4 pb-8 last:pb-2"
                            >
                                <div className="inline-flex max-w-full flex-col items-stretch">
                                    <h3 className="text-base font-bold text-[#EC5406] sm:text-lg">
                                        {ruleIndex + 1}. {title}
                                    </h3>
                                    <div className={cn("mt-3", titleUnderlineClass)} aria-hidden />
                                </div>
                                {items.map((item, itemIndex) => {
                                    const { description, subItems } = item;
                                    return (
                                        <ul
                                            key={`rule-${ruleIndex + 1}-item-${itemIndex}`}
                                            className="list-none space-y-4"
                                        >
                                            <li className="flex gap-3">
                                                <span
                                                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#EC5406]"
                                                    aria-hidden
                                                />
                                                <div className="min-w-0 font-bold text-white">
                                                    {description}
                                                </div>
                                            </li>
                                            {subItems?.length
                                                ? subItems.map((value, subIndex) => (
                                                    <ul
                                                        key={`rule-${ruleIndex + 1}-sub-${itemIndex}-${subIndex}`}
                                                        className="list-none space-y-2 border-none sm:pl-4"
                                                    >
                                                        <li className="flex gap-2">
                                                            <span
                                                                className="shrink-0 font-bold text-[#EC5406]"
                                                                aria-hidden
                                                            >
                                                                –
                                                            </span>
                                                            <span className="font-bold text-white">{value}</span>
                                                        </li>
                                                    </ul>
                                                ))
                                                : null}
                                        </ul>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );

}

function MundialContent() {
    const { login, isLoading, error, user, logout } = useUser();
    const [identification, setIdentification] = useState("");
    const [activeTab, setActiveTab] = useState("game");
    const [userPredictions, setUserPredictions] = useState<UserPrediction[]>([]);
    const loginCardRef = useRef<HTMLDivElement | null>(null);
    const tabsRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!user) {
            setUserPredictions([]);
            return;
        }

        const loadingData = async () => {
            try {
                const predRes = await ExperienceService.sport.consultUserPredictions(user.id);
                if (predRes.success) {
                    const raw = predRes.data;
                    const list = Array.isArray(raw) ? raw : raw?.items ?? raw?.predictions ?? [];
                    setUserPredictions(Array.isArray(list) ? list : []);
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadingData();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!identification.trim()) return;
        await login(identification.trim());
    };

    const handleGoToLoginCard = () => {
        loginCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
            const input = document.getElementById("identification");
            input?.focus();
        }, 350);
    };

    const handleGoToScores = () => {
        setActiveTab("scores");
        setTimeout(() => {
            tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    };


    return (
        <>

            <RulesDialog />

            <div className={cn(
                "relative overflow-hidden min-h-screen",
                "bg-black"
            )}>
                <div className="absolute inset-0 w-full h-full hidden sm:block">
                    <LightRays
                        raysOrigin="top-center"
                        raysColor="#ffffff"
                        raysSpeed={0.5}
                        lightSpread={1.4}
                        rayLength={6}
                        pulsating
                        fadeDistance={2}
                        saturation={0.8}
                        followMouse
                        mouseInfluence={0.12}
                        noiseAmount={0.05}
                        distortion={0}
                    />
                </div>

                <div className="relative z-10">
                    <Menu
                        className="text-white hover:text-white/80 bg-transparent"
                        logo="logo-monocromatico.svg"
                    />

                    <div className="space-y-6 mb-12">
                        <div className="flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20 pt-4">
                            <div className="flex max-w-2xl flex-col items-center text-center">
                                <h1
                                    className={cn(
                                        "scroll-m-20 text-balance text-3xl font-extrabold tracking-tight text-white drop-shadow-lg",
                                        "sm:text-4xl lg:text-5xl"
                                    )}
                                >
                                    Polla futbolera Inttel Go
                                </h1>
                                <p
                                    className={cn(
                                        "text-base sm:text-xl leading-7 text-balance text-white/90 drop-shadow",
                                        "max-w-xl [&:not(:first-child)]:mt-4 sm:[&:not(:first-child)]:mt-6"
                                    )}
                                >
                                    Vive cada gol con la velocidad de la fibra óptica de Inttelgo
                                </p>

                                {/* User session bar */}
                                <div className="mt-4 flex items-center gap-3">
                                    {user ? (
                                        <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
                                            <UserCheck className="h-4 w-4 text-green-400" />
                                            <span className="text-sm text-white font-medium">
                                                {`CC ${user.identificacion}`}
                                            </span>
                                            <Button
                                                onClick={logout}
                                                className=" rounded-full flex items-center gap-1"
                                                title="Cerrar sesión"
                                            >
                                                <LogOut className="h-3.5 w-3.5" />

                                                Salir
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={handleGoToLoginCard}
                                            className="flex items-center gap-2 rounded-full border border-orange-400/50 bg-orange-500/10 px-4 py-2 text-sm text-orange-300 backdrop-blur-sm hover:bg-orange-500/20 transition-colors"
                                        >
                                            <LogIn className="h-4 w-4" />
                                            Inicia sesión para participar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div ref={tabsRef} className="flex items-center justify-center pt-4 w-full px-2 sm:px-0">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full items-center">
                                <div className="overflow-x-auto pb-1 flex justify-center">
                                    <TabsList className="inline-flex h-auto gap-1 sm:gap-2 rounded-xl border border-white/20 bg-transparent p-1 text-secondary-foreground flex-nowrap">
                                        <TabsTrigger
                                            value="game"
                                            className="text-xs sm:text-sm text-white/80 px-2 sm:px-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#FF9900] data-[state=active]:to-[#EC5406] data-[state=active]:text-white data-[state=active]:backdrop-blur-md data-[state=active]:border data-[state=active]:border-white/30"
                                        >
                                            Partidos
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="group"
                                            className="text-xs sm:text-sm text-white/80 px-2 sm:px-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#FF9900] data-[state=active]:to-[#EC5406] data-[state=active]:text-white data-[state=active]:backdrop-blur-md data-[state=active]:border data-[state=active]:border-white/30"
                                        >
                                            <span className="hidden sm:inline">Fase de grupos</span>
                                            <span className="sm:hidden">Grupos</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="clasify"
                                            className="text-xs sm:text-sm text-white/80 px-2 sm:px-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#FF9900] data-[state=active]:to-[#EC5406] data-[state=active]:text-white data-[state=active]:backdrop-blur-md data-[state=active]:border data-[state=active]:border-white/30"
                                        >
                                            <span className="hidden sm:inline">Clasificaciones</span>
                                            <span className="sm:hidden">Clasif.</span>
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="scores"
                                            className="text-xs sm:text-sm text-white/80 px-2 sm:px-3 data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#FF9900] data-[state=active]:to-[#EC5406] data-[state=active]:text-white data-[state=active]:backdrop-blur-md data-[state=active]:border data-[state=active]:border-white/30"
                                        >
                                            Puntajes
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <TabsContent value="game" className="w-full flex justify-center">
                                    <Card className="w-full max-w-7xl border-none bg-white/5 text-center shadow-none backdrop-blur-md">
                                        <CardContent>
                                            <GamesList userPredictions={userPredictions} />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="group" className="w-full flex justify-center">
                                    <GroupsList />
                                </TabsContent>
                                <TabsContent value="clasify" className="w-full flex justify-center">
                                    <ClasifiesList />
                                </TabsContent>
                                <TabsContent value="scores" className="w-full flex justify-center px-4">
                                    <Scores />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    <div ref={loginCardRef} className="flex flex-col items-center justify-center py-4 px-3 sm:px-4">
                        {
                            !user ? (
                                <Card className="w-full max-w-xl p-2 sm:p-3 px-0 border-orange-500/40 overflow-hidden transition-all duration-500 ease-out shadow-2xl shadow-orange-500/60 hover:scale-[1.01] sm:hover:scale-[1.02] sm:hover:-translate-y-1 mb-8 sm:mb-12">
                                    <CardContent className="p-2 sm:p-3 px-0">
                                        <CardHeader className="px-3 sm:px-6">
                                            <CardTitle className="text-base sm:text-lg text-center uppercase flex justify-center items-center gap-2">
                                                <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#FF9900] to-[#EC5406]">
                                                    <Info className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                                </div>¡participar!</CardTitle>
                                            <CardDescription className="text-sm sm:text-base leading-relaxed pt-1 text-center sm:text-left">
                                                Para participar ingresa el número de indentificacion del titular del servicio
                                            </CardDescription>
                                        </CardHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center px-3 sm:px-6">
                                            <div className="space-y-2 w-full">
                                                <Label htmlFor="identification" className="text-sm sm:text-base">Número de cédula</Label>
                                                <Input
                                                    id="identification"
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="Ej. 1234567890"
                                                    value={identification}
                                                    onChange={(e) => setIdentification(e.target.value)}
                                                    disabled={isLoading}
                                                    autoFocus
                                                />
                                            </div>

                                            {error && (
                                                <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-700 w-full">
                                                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                                                    <span>{error}</span>
                                                </div>
                                            )}

                                            <CardFooter className="pt-2 w-full px-0">
                                                <Button
                                                    variant={"orange"}
                                                    type="submit"
                                                    disabled={isLoading || !identification.trim()}
                                                    className="w-full"
                                                >
                                                    {isLoading ? (
                                                        <LoadingSpinner size="sm" />
                                                    ) : (
                                                        <>
                                                            Ingresar
                                                        </>
                                                    )}
                                                </Button>
                                            </CardFooter>
                                        </form>
                                    </CardContent>
                                </Card>

                            ) : (
                                <div className="space-y-2">
                                    <UserPuntuation predictionsData={userPredictions} />
                                    <Card
                                        className="w-full border-none bg-gradient-to-r from-[#1a0d05] to-[#EC5406] text-white cursor-pointer rounded-xl hover:scale-[1.02] transition-transform duration-300"
                                        onClick={handleGoToScores}
                                    >
                                        <CardContent className="flex items-center justify-between gap-3 sm:gap-6 py-4 sm:py-6 px-4 sm:px-8">
                                            <span className="font-extrabold uppercase text-base sm:text-2xl lg:text-3xl leading-tight">
                                                Mira tú posición en el top de los clientes
                                            </span>
                                            <MousePointerClick className="h-10 w-10 sm:h-14 sm:w-14 shrink-0 text-white/80 animate-bounce" />
                                            <Button
                                                variant="outline"
                                                className="shrink-0 bg-white text-gray-900 font-bold hover:bg-white/90 border-none text-sm sm:text-lg px-3 sm:px-6"
                                                onClick={(e) => { e.stopPropagation(); handleGoToScores(); }}
                                            >
                                                Ver más
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

function Mundial() {
    return (
        <>
            <SEO
                title="Mundial 2026 - Inttelgo | Disfruta cada partido con fibra óptica"
                description="Vive el Mundial 2026 con la mejor conexión a internet. Planes de fibra óptica de alta velocidad para que no te pierdas ningún gol."
                keywords="mundial 2026, internet fibra óptica, internet alta velocidad, inttelgo, ver mundial 2026 online"
                ogTitle="Mundial 2026 - Inttelgo"
                ogDescription="Vive el Mundial 2026 con la mejor conexión a internet de fibra óptica."
                ogUrl="https://inttelgo.com/mundial-2026"
                canonical="https://inttelgo.com/mundial-2026"
            />
            <div className="w-full flex flex-col">
                <Suspense fallback={<LoadingSpinner fullScreen size="xl" />}>
                    <UserProvider>
                        <MundialContent />
                    </UserProvider>
                </Suspense>
            </div>
        </>
    );
}

export default Mundial;
