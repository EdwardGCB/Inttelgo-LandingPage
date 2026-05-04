import ExperienceService from '@/services/ExperienceService';
import React, { useEffect, useRef, useState } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '../ui/badge';
import type { Match } from '@/interfaces/game';
import { Button } from '../ui/button';
import { useUser } from '@/contexts/User';
import { useSocket } from '@/contexts/SocketContext';
import { LockKeyhole } from 'lucide-react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
    DrawerTrigger,
} from '../ui/drawer';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from '@/components/ui/input-otp';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const PAGE_SIZE = 4;

// Solo se puede pronosticar si el partido aún no empezó
const PREDICTABLE_STATUSES = new Set(['SCHEDULED', 'TIMED']);
function canPredict(status: string) {
    return PREDICTABLE_STATUSES.has(status);
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    SCHEDULED: { label: 'Programado', className: 'bg-blue-500/20 text-blue-300 border border-blue-500/40' },
    TIMED: { label: 'Programado', className: 'bg-blue-500/20 text-blue-300 border border-blue-500/40' },
    IN_PLAY: { label: 'En juego', className: 'bg-green-500/20 text-green-300 border border-green-500/40' },
    PAUSED: { label: 'Pausado', className: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' },
    LIVE: { label: 'En vivo', className: 'bg-green-500/20 text-green-300 border border-green-500/40' },
    FINISHED: { label: 'Finalizado', className: 'bg-gray-500/20 text-gray-300 border border-gray-500/40' },
    POSTPONED: { label: 'Aplazado', className: 'bg-orange-500/20 text-orange-300 border border-orange-500/40' },
    CANCELLED: { label: 'Cancelado', className: 'bg-red-500/20 text-red-300 border border-red-500/40' },
    SUSPENDED: { label: 'Suspendido', className: 'bg-red-500/20 text-red-300 border border-red-500/40' },
};

function formatTime(utcDate: string): string {
    return new Date(utcDate).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Bogota',
    });
}

function formatDayHeader(dateStr: string): string {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'America/Bogota',
    });
}

function groupMatches(matches: Match[]): Record<string, Record<string, Match[]>> {
    return matches.reduce((acc, match) => {
        const jornada = `Jornada ${match.matchday}`;
        const date = match.utcDate.slice(0, 10);
        if (!acc[jornada]) acc[jornada] = {};
        if (!acc[jornada][date]) acc[jornada][date] = [];
        acc[jornada][date].push(match);
        return acc;
    }, {} as Record<string, Record<string, Match[]>>);
}

const predictionSchema = z.object({
    homeScore: z.string().length(1, 'Ingresa el marcador local'),
    awayScore: z.string().length(1, 'Ingresa el marcador visitante'),
});
type PredictionValues = z.infer<typeof predictionSchema>;
type SavedPrediction = { home: string; away: string };
interface UserPrediction {
    id: string;
    match: number | string | { id?: number | string };
    homeScore: number;
    awayScore: number;
}

function resolvePredictionMatchId(pred: UserPrediction): number | null {
    const raw = pred.match;
    if (raw == null) return null;
    if (typeof raw === "object" && "id" in raw) {
        const n = Number((raw as { id?: number | string }).id);
        return Number.isFinite(n) ? n : null;
    }
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
}

function getPredictionForMatch(
    predictions: Record<number, SavedPrediction>,
    matchId: number
): SavedPrediction | undefined {
    if (!Number.isFinite(matchId)) return undefined;
    return predictions[matchId];
}

function formatMatchDate(utcDate: string): string {
    return new Date(utcDate).toLocaleDateString('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Bogota',
    });
}

function PredictionScoreBadge({ home, away }: { home: string; away: string }) {
    return (
        <div className="text-center align-middle text-primary-foreground font-bold text-xl tabular-nums ">
            <span>{home}</span>-<span>{away}</span>
        </div>
    );
}

function PredictionDrawer({
    match,
    saved,
    onSave,
    scoreShownOutside = false,
}: {
    match: Match;
    saved?: { home: string; away: string };
    onSave: (home: string, away: string) => void;
    scoreShownOutside?: boolean;
}) {
    const { user } = useUser();
    const [open, setOpen] = useState(false);

    const form = useForm<PredictionValues>({
        resolver: zodResolver(predictionSchema),
        defaultValues: { homeScore: saved?.home ?? '0', awayScore: saved?.away ?? '0' },
    });

    useEffect(() => {
        if (open) {
            form.reset({ homeScore: saved?.home ?? '0', awayScore: saved?.away ?? '0' });
        }
    }, [open]);

    const onSubmit = (values: PredictionValues) => {
        if (scoreShownOutside) {
            ExperienceService.sport.updateUserPredictions(user!!.id, match.id, { name: `${user!!.nombre1} ${user!!.apellido1}`, ...values })
        } else {
            ExperienceService.sport.createUserPredictions(user!!.id, match.id, { name: `${user!!.nombre1} ${user!!.apellido1}`, ...values }).then((res) => {
                if (!res.success) {
                    return
                }
                onSave(res.data.homeScore, res.data.awayScore);
                setOpen(false)

            }).catch((e) => console.error(e)).finally(() => { })
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                    {saved && !scoreShownOutside ? (
                        <>
                            <span className="font-bold text-orange-500">{saved.home}-{saved.away}</span>
                            <span className="text-muted-foreground text-xs">Editar</span>
                        </>
                    ) : saved && scoreShownOutside ? (
                        <span className="text-xs">Editar</span>
                    ) : (
                        'Pronosticar'
                    )}
                </Button>
            </DrawerTrigger>

            <DrawerContent className="pb-safe">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="text-center">
                        <DrawerTitle className="text-base font-bold uppercase tracking-wide">
                            Ingresa tu pronóstico
                        </DrawerTitle>
                        <DrawerDescription className="capitalize text-sm">
                            {formatMatchDate(match.utcDate)}
                        </DrawerDescription>
                    </DrawerHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 space-y-6">
                            {/* Equipos + OTP */}
                            <div className="flex items-center justify-between gap-3">
                                {/* Equipo local */}
                                <div className="flex flex-col items-center gap-2 flex-1">
                                    <img
                                        src={match.homeTeam.crest}
                                        alt={match.homeTeam.shortName}
                                        className="w-14 h-14 object-contain"
                                    />
                                    <span className="text-xs font-bold uppercase text-center leading-tight">
                                        {match.homeTeam.name}
                                    </span>
                                    <Badge variant="secondary" className="text-[10px]">Local</Badge>
                                </div>

                                {/* OTP scores */}
                                <div className="flex flex-col items-center gap-4 shrink-0">
                                    <FormField
                                        control={form.control}
                                        name="homeScore"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-center gap-1">
                                                <FormLabel className="text-xs text-muted-foreground">Local</FormLabel>
                                                <FormControl>
                                                    <InputOTP maxLength={1} value={field.value} onChange={field.onChange}>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={0} className="h-14 w-12 text-2xl font-extrabold border-2 border-orange-400 rounded-lg" />
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <InputOTPSeparator className="text-2xl font-bold text-muted-foreground" />

                                    <FormField
                                        control={form.control}
                                        name="awayScore"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col items-center gap-1">
                                                <FormLabel className="text-xs text-muted-foreground">Visitante</FormLabel>
                                                <FormControl>
                                                    <InputOTP maxLength={1} value={field.value} onChange={field.onChange}>
                                                        <InputOTPGroup>
                                                            <InputOTPSlot index={0} className="h-14 w-12 text-2xl font-extrabold border-2 border-orange-400 rounded-lg" />
                                                        </InputOTPGroup>
                                                    </InputOTP>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Equipo visitante */}
                                <div className="flex flex-col items-center gap-2 flex-1">
                                    <img
                                        src={match.awayTeam.crest}
                                        alt={match.awayTeam.shortName}
                                        className="w-14 h-14 object-contain"
                                    />
                                    <span className="text-xs font-bold uppercase text-center leading-tight">
                                        {match.awayTeam.name}
                                    </span>
                                    <Badge variant="secondary" className="text-[10px]">Visitante</Badge>
                                </div>
                            </div>

                            <DrawerFooter className="px-0 pb-2">
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-b from-[#FF9900] to-[#EC5406] text-white font-bold text-base hover:opacity-90"
                                >
                                    Pronosticar
                                </Button>
                                <DrawerClose asChild>
                                    <Button variant="outline" className="w-full">Cancelar</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </form>
                    </Form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function GamesList({ userPredictions = [] }: { userPredictions?: UserPrediction[] }) {
    const { user } = useUser();
    const { latestEvent } = useSocket();
    const competitionId = "2001"
    const conditions = {
        //matchday: 1,
        dateFrom: "2025-09-16",
        //dateFrom: "2026-06-11",
        dateTo: "2026-05-30"
        //dateTo: "2026-06-27"
    }
    const [games, setGames] = useState<Match[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [predictions, setPredictions] = useState<Record<number, SavedPrediction>>({});
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [liveScores, setLiveScores] = useState<Record<number, { home: number; away: number }>>({});
    const [goalFlash, setGoalFlash] = useState<number | null>(null);
    const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setLoadingData(true);
        ExperienceService.sport.consultMatches(competitionId, conditions).then((res) => {
            if (res.success) {
                setGames(res.data.matches)
            }
        }).catch((e) => {
            console.error(e);
        }).finally(() => setLoadingData(false))
    }, [])

    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [games]);

    useEffect(() => {
        const mappedPredictions = userPredictions.reduce<Record<number, SavedPrediction>>((acc, pred) => {
            const mid = resolvePredictionMatchId(pred);
            if (mid == null) return acc;
            acc[mid] = {
                home: String(pred.homeScore ?? 0),
                away: String(pred.awayScore ?? 0),
            };
            return acc;
        }, {});
        setPredictions(mappedPredictions);
    }, [userPredictions]);

    // Escuchar eventos en vivo del WebSocket
    useEffect(() => {
        if (!latestEvent) return;
        const { event, data } = latestEvent;
        const matchId = data.match_id;

        // Actualizar marcador
        if ((event === 'goal' || event === 'goal_cancelled') && data.score) {
            setLiveScores((prev) => ({
                ...prev,
                [matchId]: { home: data.score!.home, away: data.score!.away },
            }));

            if (event === 'goal') {
                if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
                setGoalFlash(matchId);
                flashTimerRef.current = setTimeout(() => setGoalFlash(null), 4000);
            }
        }

        // Actualizar status siempre que venga en el payload (goal, goal_cancelled, status_changed)
        if (data.status) {
            setGames((prev) =>
                prev.map((m) =>
                    m.id === matchId ? { ...m, status: data.status as Match['status'] } : m
                )
            );
        }
    }, [latestEvent]);

    const handlePrediction = (matchId: number, home: string, away: string) => {
        setPredictions(prev => ({
            ...prev,
            [matchId]: { home, away },
        }));
    };

    if (loadingData)
        return <LoadingSpinner />

    const visibleGames = games.slice(0, visibleCount);
    const grouped = groupMatches(visibleGames);
    const classNameHead = "py-3 px-3";
    const classNameHeadContent = "bg-gradient-to-b from-[#FF9900] to-[#EC5406] text-white text-center font-bold uppercase tracking-widest rounded-md py-2 px-4";
    const tableHeaders = [
        { label: "Hora", width: "w-28" },
        { label: "Partido", width: "w-92" },
        { label: "Resultado", width: "w-32" },
        ...(user ? [{ label: "Pronostico", width: "w-32" }] : []),
    ];

    return (
        <div className="space-y-4 w-full">

            {/* ── MOBILE: tarjetas ── */}
            <div className="block md:hidden space-y-4">
                {Object.entries(grouped).map(([jornada, dateGroups]) => (
                    <React.Fragment key={jornada}>
                        <div className="flex items-center gap-3 px-1 pt-2">
                            <span className="bg-orange-500 text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-md px-3 py-1">
                                {jornada}
                            </span>
                            <div className="flex-1 h-px bg-orange-500/30" />
                        </div>
                        {Object.entries(dateGroups).map(([date, matches]) => (
                            <React.Fragment key={date}>
                                <div className="flex items-center gap-2 px-1">
                                    <div className="w-1 h-4 rounded-full bg-secondary" />
                                    <span className="text-primary-foreground text-xs capitalize">
                                        {formatDayHeader(date)}
                                    </span>
                                </div>
                                {matches.map((match) => {
                                    const live = liveScores[match.id];
                                    const homeScore = live?.home ?? match.score?.fullTime?.home ?? 0;
                                    const awayScore = live?.away ?? match.score?.fullTime?.away ?? 0;
                                    const isFlashing = goalFlash === match.id;
                                    const pred = getPredictionForMatch(predictions, Number(match.id));
                                    const status = STATUS_LABELS[match.status] ?? { label: match.status, className: 'bg-gray-500/20 text-gray-300 border border-gray-500/40' };
                                    const predictable = canPredict(match.status);
                                    return (
                                        <div key={match.id} className={`rounded-xl px-4 py-3 space-y-2 transition-colors duration-700 ${isFlashing ? 'bg-green-900/60 ring-1 ring-green-500/60' : 'bg-[#3a2010]'}`}>
                                            {/* Badges + hora */}
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge>{match.group?.replace(/_/g, ' ')}</Badge>
                                                    <Badge variant="secondary" className={status.className}>{status.label}</Badge>
                                                    {isFlashing && (
                                                        <span className="flex items-center gap-1 text-green-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                                            ⚽ Gol
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-white/70 text-xs font-semibold">
                                                    {formatTime(match.utcDate)}
                                                </span>
                                            </div>
                                            {/* Equipos */}
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex flex-col items-center gap-1 flex-1">
                                                    <img src={match.homeTeam.crest} alt={match.homeTeam.shortName} className="w-8 h-8 object-contain" />
                                                    <span className="text-white font-bold uppercase text-xs text-center leading-tight">{match.homeTeam.shortName}</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-1.5 shrink-0">
                                                    <span className={`font-extrabold text-xl transition-colors duration-300 ${isFlashing ? 'text-green-400' : 'text-white'}`}>
                                                        {homeScore}-{awayScore}
                                                    </span>
                                                    {user && pred && (
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="text-[10px] font-bold uppercase text-white/50">Tu pronóstico</span>
                                                            <PredictionScoreBadge home={pred.home} away={pred.away} />
                                                        </div>
                                                    )}
                                                    {user && predictable && (
                                                        <PredictionDrawer
                                                            match={match}
                                                            saved={pred}
                                                            scoreShownOutside={!!pred}
                                                            onSave={(home, away) => handlePrediction(match.id, home, away)}
                                                        />
                                                    )}
                                                    {user && !predictable && !pred && (
                                                        <span className="text-white/30 text-[10px] font-semibold uppercase">Pronóstico cerrado</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-center gap-1 flex-1">
                                                    <img src={match.awayTeam.crest} alt={match.awayTeam.shortName} className="w-8 h-8 object-contain" />
                                                    <span className="text-white font-bold uppercase text-xs text-center leading-tight">{match.awayTeam.shortName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                ))}
            </div>

            {/* ── DESKTOP: tabla ── */}
            <div className="hidden md:block overflow-x-auto">
                <Table className="min-w-[640px]">
                    <TableHeader>
                        <TableRow className="border-none hover:bg-transparent">
                            {tableHeaders.map((header) => (
                                <TableHead key={header.label} className={`${classNameHead} ${header.width}`}>
                                    <div className={classNameHeadContent}>
                                        {header.label}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(grouped).map(([jornada, dateGroups]) => (
                            <React.Fragment key={jornada}>
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableCell colSpan={4} className="px-3 pt-4 pb-1">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-orange-500 text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-md px-3 py-1">
                                                {jornada}
                                            </span>
                                            <div className="flex-1 h-px bg-orange-500/30" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {Object.entries(dateGroups).map(([date, matches]) => (
                                    <React.Fragment key={date}>
                                        <TableRow className="border-none hover:bg-transparent">
                                            <TableCell colSpan={4} className="px-3 pt-3 pb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1 h-4 rounded-full bg-secondary" />
                                                    <span className="text-primary-foreground text-xs capitalize">
                                                        {formatDayHeader(date)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {matches.map((match) => {
                                            const live = liveScores[match.id];
                                            const homeScore = live?.home ?? match.score?.fullTime?.home ?? 0;
                                            const awayScore = live?.away ?? match.score?.fullTime?.away ?? 0;
                                            const isFlashing = goalFlash === match.id;
                                            const pred = getPredictionForMatch(predictions, Number(match.id));
                                            const status = STATUS_LABELS[match.status] ?? { label: match.status, className: 'bg-gray-500/20 text-gray-300 border border-gray-500/40' };
                                            const predictable = canPredict(match.status);
                                            return (
                                                <TableRow key={match.id} className="border-none hover:bg-transparent">
                                                    <TableCell className="py-2 px-3 text-center align-middle">
                                                        <span className="text-white font-semibold">{formatTime(match.utcDate)}</span>
                                                    </TableCell>
                                                    <TableCell className="py-2 px-3">
                                                        <div className={`flex flex-col items-center gap-2 rounded-xl px-4 py-3 transition-colors duration-700 ${isFlashing ? 'bg-green-900/60 ring-1 ring-green-500/60' : 'bg-[#3a2010]'}`}>
                                                            <div className="flex items-center gap-2">
                                                                <Badge>{match.group?.replace(/_/g, ' ')}</Badge>
                                                                <Badge variant="secondary" className={status.className}>{status.label}</Badge>
                                                                {isFlashing && (
                                                                    <span className="flex items-center gap-1 text-green-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                                                        ⚽ Gol
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center justify-center gap-3">
                                                                <div className="inline-flex items-center gap-2 text-white rounded-lg px-3 py-2 font-bold uppercase text-sm">
                                                                    <img src={match.homeTeam.crest} alt={match.homeTeam.shortName} className="w-6 h-6 object-contain shrink-0" />
                                                                    <span>{match.homeTeam.shortName}</span>
                                                                </div>
                                                                <span className="text-white font-bold shrink-0">vs</span>
                                                                <div className="inline-flex items-center gap-2 text-white rounded-lg px-3 py-2 font-bold uppercase text-sm">
                                                                    <img src={match.awayTeam.crest} alt={match.awayTeam.shortName} className="w-6 h-6 object-contain shrink-0" />
                                                                    <span>{match.awayTeam.shortName}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-2 px-3 text-center align-middle">
                                                        <span className={`font-bold text-xl transition-colors duration-300 ${isFlashing ? 'text-green-400' : 'text-primary-foreground'}`}>
                                                            {homeScore}-{awayScore}
                                                        </span>
                                                    </TableCell>
                                                    {user && (
                                                        <TableCell className="py-2 px-3 text-center align-middle">
                                                            <div className="flex flex-col items-center justify-center gap-2">
                                                                {pred && (
                                                                    <PredictionScoreBadge home={pred.home} away={pred.away} />
                                                                )}
                                                                {predictable ? (
                                                                    <PredictionDrawer
                                                                        match={match}
                                                                        saved={pred}
                                                                        scoreShownOutside={!!pred}
                                                                        onSave={(home, away) => handlePrediction(match.id, home, away)}
                                                                    />
                                                                ) : (
                                                                    !pred && (
                                                                        <span className="text-white/30 text-xs font-semibold uppercase">Cerrado</span>
                                                                    )
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {!user && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-orange-400/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-300">
                    <LockKeyhole className="h-4 w-4 shrink-0" />
                    <span>Inicia sesión para registrar tus pronósticos.</span>
                </div>
            )}

            {(games.length > PAGE_SIZE) && (
                <div className="flex justify-center gap-3">
                    {visibleCount > PAGE_SIZE && (
                        <Button variant="outline" type="button" onClick={() => setVisibleCount(PAGE_SIZE)}>
                            Ver menos
                        </Button>
                    )}
                    {visibleCount < games.length && (
                        <Button variant="orange" type="button" onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}>
                            Ver más
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}

export default GamesList
