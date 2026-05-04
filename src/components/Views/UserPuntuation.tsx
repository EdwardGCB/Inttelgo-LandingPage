import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useUser } from "@/contexts/User";
import type { Prediction } from "@/interfaces/game";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

const LIVE_STATUSES = new Set(["IN_PLAY", "PAUSED", "LIVE"]);
const FINISHED_STATUSES = new Set(["FINISHED"]);

function predictionColor(prediction: Prediction): "correct" | "wrong" | "live" | "none" {
    const { match, homeScore, awayScore } = prediction;
    const status = match.status;
    if (LIVE_STATUSES.has(status)) return "live";
    if (!FINISHED_STATUSES.has(status)) return "none";

    const realHome = match.score.fullTime.home;
    const realAway = match.score.fullTime.away;
    if (realHome === null || realAway === null) return "none";

    return homeScore === realHome && awayScore === realAway ? "correct" : "wrong";
}

const pronosticoCellClass: Record<string, string> = {
    correct: "bg-green-100 border-2 border-green-400 text-green-800",
    wrong: "bg-red-100 border-2 border-red-400 text-red-800",
    live: "border-2 border-orange-400 bg-white text-gray-800",
    none: "border-2 border-orange-400 bg-white text-gray-800",
};

const classNameHeadContent =
    "bg-gradient-to-b from-[#FF9900] to-[#EC5406] text-white text-center font-bold uppercase tracking-widest rounded-md py-2 px-4";
const classNameHead = "py-3 px-3";

const tableHeaders = [
    { label: "Partido", width: "w-80" },
    { label: "Resultado", width: "w-32" },
    { label: "Pronostico", width: "w-32" },
    { label: "Puntaje", width: "w-28" },
];

type PredictionItem = Omit<Prediction, "id" | "match" | "points" | "puntuation"> & {
    id: string | number;
    match: Prediction["match"] | number | string | { id?: number | string };
    puntuation?: number;
};

function hasMatchData(match: PredictionItem["match"]): match is Prediction["match"] {
    return typeof match === "object" && match !== null && "homeTeam" in match && "awayTeam" in match;
}

function getResultScore(match: PredictionItem["match"]) {
    if (!hasMatchData(match)) return { home: 0, away: 0 };
    const home = match.score?.fullTime?.home ?? 0;
    const away = match.score?.fullTime?.away ?? 0;
    return { home, away };
}

function ScoreBox({ home, away, className }: { home: number; away: number; className?: string }) {
    return (
        <div
            className={cn(`py-2 px-3 text-center align-middle text-primary-foreground font-bold text-xl`, className)}
        >
            <span>{home}</span>
            <span>-</span>
            <span>{away}</span>
        </div>
    );
}

function UserPuntuation({ predictionsData = [] }: { predictionsData?: PredictionItem[] }) {
    const { user } = useUser();
    const [predictions, setPredictions] = useState<PredictionItem[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPredictions(predictionsData);
    }, [predictionsData]);

    if (!user) return null;

    const totalPages = Math.max(1, Math.ceil(predictions.length / PAGE_SIZE));
    const paginated = predictions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const totalPoints = predictions.reduce((sum, p) => sum + (p.puntuation ?? 0), 0);
    const userFullName = [user.nombre1, user.nombre2, user.apellido1, user.apellido2]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="w-full max-w-7xl space-y-6 px-2 sm:px-0">
            {/* Header card */}
            <Card className="bg-gradient-to-b from-[#3a2010]/10 to-[#EC5406]/40 border-none text-primary-foreground">
                <CardContent className="pt-4">
                    <div className="flex flex-col sm:grid sm:grid-cols-2 items-start sm:items-center gap-4">
                        <div>
                            <span className="font-bold text-2xl sm:text-4xl leading-tight">{userFullName}</span>
                            <Separator className="my-2" />
                            <span className="text-base sm:text-xl">
                                {`${user.tipoIdentificacion?.descripcion ?? "CC"}. ${user.identificacion}`}
                            </span>
                        </div>
                        <div className="flex gap-4 justify-start sm:justify-center w-full">
                            <div className="flex flex-col items-center gap-2">
                                <span className="font-bold uppercase text-xs sm:text-sm">Posición</span>
                                <Card className="p-2">
                                    <CardContent className="text-center px-3 py-1">
                                        <span className="font-extrabold text-3xl sm:text-4xl">1</span>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="font-bold uppercase text-xs sm:text-sm">Puntaje Total</span>
                                <Card className="p-2 w-full">
                                    <CardContent className="text-center px-3 py-1">
                                        <span className="font-extrabold text-3xl sm:text-4xl">{totalPoints}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Predictions */}
            <div className="space-y-4">
                {predictions.length === 0 ? (
                    <div className="flex items-center justify-center py-12 text-white/50 text-sm">
                        Aún no has registrado pronósticos.
                    </div>
                ) : (
                    <>
                        {/* ── MOBILE: tarjetas ── */}
                        <div className="block md:hidden space-y-3">
                            {paginated.map((pred) => {
                                const { match } = pred;
                                const color = hasMatchData(match) ? predictionColor(pred as Prediction) : "none";
                                const { home: realHome, away: realAway } = getResultScore(match);
                                return (
                                    <div key={pred.id} className="rounded-xl bg-[#3a2010] px-4 py-3 space-y-3">
                                        {/* Teams */}
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex flex-col items-center gap-1 flex-1">
                                                {hasMatchData(match) ? (
                                                    <>
                                                        <img src={match.homeTeam.crest} alt={match.homeTeam.shortName} className="w-8 h-8 object-contain" />
                                                        <span className="text-white font-bold uppercase text-[10px] text-center">{match.homeTeam.shortName}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-white/70 font-bold uppercase text-[10px] text-center">Local</span>
                                                )}
                                            </div>
                                            <Badge variant="secondary" className="text-[10px] shrink-0">
                                                {hasMatchData(match) ? match.group?.replace(/_/g, " ") : `Match ${match}`}
                                            </Badge>
                                            <div className="flex flex-col items-center gap-1 flex-1">
                                                {hasMatchData(match) ? (
                                                    <>
                                                        <img src={match.awayTeam.crest} alt={match.awayTeam.shortName} className="w-8 h-8 object-contain" />
                                                        <span className="text-white font-bold uppercase text-[10px] text-center">{match.awayTeam.shortName}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-white/70 font-bold uppercase text-[10px] text-center">Visitante</span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Scores row */}
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="space-y-1">
                                                <p className="text-white/50 text-[10px] uppercase font-bold">Resultado</p>
                                                <ScoreBox home={realHome} away={realAway} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-white/50 text-[10px] uppercase font-bold">Pronóstico</p>
                                                <ScoreBox home={pred.homeScore} away={pred.awayScore} className={` rounded-lg ${pronosticoCellClass[color]} text-md py-0.5`} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-white/50 text-[10px] uppercase font-bold">Puntaje</p>
                                                <div className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-b from-[#FF9900] to-[#EC5406] text-white font-extrabold text-sm px-2 py-1.5">
                                                    {pred.puntuation ?? 0}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── DESKTOP: tabla ── */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table className="min-w-[600px]">
                                <TableHeader>
                                    <TableRow className="border-none hover:bg-transparent">
                                        {tableHeaders.map((h) => (
                                            <TableHead key={h.label} className={`${classNameHead} ${h.width}`}>
                                                <div className={classNameHeadContent}>{h.label}</div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginated.map((pred) => {
                                        const { match } = pred;
                                        const color = hasMatchData(match) ? predictionColor(pred as Prediction) : "none";
                                        const { home: realHome, away: realAway } = getResultScore(match);
                                        return (
                                            <TableRow key={pred.id} className="border-none hover:bg-transparent">
                                                <TableCell className="py-2 px-3">
                                                    <div className="flex flex-col items-center gap-1.5 bg-[#3a2010] rounded-xl px-4 py-3">
                                                        <Badge variant="secondary" className="text-[10px]">
                                                            {hasMatchData(match) ? match.group?.replace(/_/g, " ") : `Match ${match}`}
                                                        </Badge>
                                                        <div className="flex items-center justify-center gap-3">
                                                            {hasMatchData(match) ? (
                                                                <div className="inline-flex items-center gap-2 text-white font-bold uppercase text-sm">
                                                                    <img src={match.homeTeam.crest} alt={match.homeTeam.shortName} className="w-5 h-5 object-contain shrink-0" />
                                                                    <span>{match.homeTeam.shortName}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="inline-flex items-center gap-2 text-white/70 font-bold uppercase text-sm">
                                                                    <span>Local</span>
                                                                </div>
                                                            )}
                                                            <span className="text-white/60 font-bold shrink-0">vs</span>
                                                            {hasMatchData(match) ? (
                                                                <div className="inline-flex items-center gap-2 text-white font-bold uppercase text-sm">
                                                                    <img src={match.awayTeam.crest} alt={match.awayTeam.shortName} className="w-5 h-5 object-contain shrink-0" />
                                                                    <span>{match.awayTeam.shortName}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="inline-flex items-center gap-2 text-white/70 font-bold uppercase text-sm">
                                                                    <span>Visitante</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2 px-3 text-center align-middle">
                                                    <ScoreBox home={realHome} away={realAway} />
                                                </TableCell>
                                                <TableCell className="py-2 px-3 text-center align-middle">
                                                    <ScoreBox home={pred.homeScore} away={pred.awayScore} className={`rounded-lg ${pronosticoCellClass[color]}`} />
                                                </TableCell>
                                                <TableCell className="py-2 px-3 text-center align-middle">
                                                    <div className="inline-flex items-center justify-center rounded-lg bg-gradient-to-b from-[#FF9900] to-[#EC5406] text-white font-extrabold text-lg min-w-[72px] px-3 py-1.5">
                                                        {pred.puntuation ?? 0}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 pt-2">
                                <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm text-white/70">Página {page} de {totalPages}</span>
                                <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default UserPuntuation;
