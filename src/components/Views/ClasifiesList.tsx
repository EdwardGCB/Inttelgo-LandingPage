import ExperienceService from '@/services/ExperienceService';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { Match, Team } from '@/interfaces/game';

const TEAM_NAMES: Record<string, string> = {
    "Mexico": "México", "South Africa": "Sudáfrica", "Korea Republic": "Corea del Sur",
    "Canada": "Canadá", "Qatar": "Catar", "Switzerland": "Suiza", "Brazil": "Brasil",
    "Morocco": "Marruecos", "Haiti": "Haití", "Scotland": "Escocia",
    "USA": "EE.UU.", "United States": "EE.UU.", "Paraguay": "Paraguay", "Australia": "Australia",
    "Germany": "Alemania", "Curaçao": "Curazao", "Ivory Coast": "Costa de Marfil", "Ecuador": "Ecuador",
    "Netherlands": "Holanda", "Japan": "Japón", "Tunisia": "Túnez", "Belgium": "Bélgica",
    "Egypt": "Egipto", "Iran": "Irán", "New Zealand": "Nueva Zelanda", "Spain": "España",
    "Uruguay": "Uruguay", "France": "Francia", "Senegal": "Senegal", "Norway": "Noruega",
    "Argentina": "Argentina", "Austria": "Austria", "Jordan": "Jordania", "Portugal": "Portugal",
    "Uzbekistan": "Uzbekistán", "Colombia": "Colombia", "England": "Inglaterra", "Croatia": "Croacia",
    "Ghana": "Ghana", "Panama": "Panamá", "Czechia": "Chequia", "Bosnia-Herzegovina": "Bosnia-Herz.",
    "Saudi Arabia": "Arabia Saudita", "Nigeria": "Nigeria", "Venezuela": "Venezuela",
    "Honduras": "Honduras", "Costa Rica": "Costa Rica", "Jamaica": "Jamaica", "Peru": "Perú",
    "Chile": "Chile", "Bolivia": "Bolivia", "Turkey": "Türkiye", "Ukraine": "Ucrania",
    "Poland": "Polonia", "Romania": "Rumanía", "Hungary": "Hungría", "Serbia": "Serbia",
    "Denmark": "Dinamarca", "Sweden": "Suecia", "Finland": "Finlandia", "Slovakia": "Eslovaquia",
    "Slovenia": "Eslovenia", "Greece": "Grecia", "Albania": "Albania", "Georgia": "Georgia",
    "Iceland": "Islandia", "Ireland": "Irlanda", "Wales": "Gales", "Cameroon": "Camerún",
    "Mali": "Malí", "Algeria": "Argelia", "Angola": "Angola", "Congo DR": "R.D. Congo",
    "China PR": "China", "Indonesia": "Indonesia", "Iraq": "Irak", "Kuwait": "Kuwait",
    "Bahrain": "Baréin", "Oman": "Omán", "UAE": "Emiratos Árabes", "United Arab Emirates": "Emiratos Árabes",
    "New Caledonia": "Nueva Caledonia",
};

const KNOCKOUT_STAGES = ['LAST_32', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'FINAL', 'THIRD_PLACE'];
const STAGE_LABELS: Record<string, string> = {
    LAST_32: 'Ronda de 32', LAST_16: 'Octavos de final',
    QUARTER_FINALS: 'Cuartos de final', SEMI_FINALS: 'Semifinales',
    FINAL: 'Final', THIRD_PLACE: 'Tercer lugar',
};
const STAGE_HALF_COUNT: Record<string, number> = {
    LAST_32: 8, LAST_16: 4, QUARTER_FINALS: 2, SEMI_FINALS: 1,
};
const BRACKET_WIDTH = 1400;

function teamName(team: Team) {
    return TEAM_NAMES[team.name] ?? TEAM_NAMES[team.shortName] ?? team.shortName;
}

// ── Scale hook ─────────────────────────────────────────────────────────────────
function useBracketScale() {
    const [scale, setScale] = useState(1);
    useEffect(() => {
        const update = () => {
            const s = Math.min(1, (window.innerWidth - 32) / BRACKET_WIDTH);
            setScale(s);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);
    return scale;
}

// ── Team slot ──────────────────────────────────────────────────────────────────
function TeamSlot({ team, score, winner }: { team?: Team; score?: number | null; winner?: boolean }) {
    if (!team) {
        return (
            <div className=" w-[90%] flex items-center bg-white/10 rounded-lg rounded-tl-none h-7 flex-1 gap-1">
                <div className="w-7 h-7 bg-white/10 rounded-lg rounded-tl-none shrink-0" />
                <span className="text-white/30 font-semibold text-[9px] uppercase">Por definirse</span>
            </div>
        );
    }
    return (
        <div className="flex items-center h-7 ml-2">
            <div className="w-7 h-7 flex items-center justify-center bg-white rounded-lg rounded-tl-none shadow-sm border border-gray-100 shrink-0">
                <img src={team.crest} alt={team.shortName} className="w-4 h-4 object-contain" />
            </div>
            <div className={`flex items-center rounded-lg rounded-tl-none h-7 flex-1 pl-7 pr-2 ${winner ? 'bg-orange-50' : 'bg-white'}`}>
                <span className={`font-extrabold uppercase tracking-wide text-[9px] flex-1 truncate ${winner ? 'text-orange-600' : 'text-gray-900'}`}>
                    {teamName(team)}
                </span>
                {score != null && (
                    <span className={`text-[9px] font-extrabold ml-1 shrink-0 ${winner ? 'text-orange-500' : 'text-gray-400'}`}>
                        {score}
                    </span>
                )}
            </div>
        </div>
    );
}

function MatchCard({ match }: { match?: Match }) {
    const w = match?.score?.winner;
    return (
        <div className="flex flex-col gap-1 w-full">
            <TeamSlot team={match?.homeTeam} score={match?.score?.fullTime?.home} winner={w === 'HOME_TEAM'} />
            <TeamSlot team={match?.awayTeam} score={match?.score?.fullTime?.away} winner={w === 'AWAY_TEAM'} />
        </div>
    );
}

// ── Mobile helpers ─────────────────────────────────────────────────────────────
function formatMobileDate(utcDate: string): string {
    return new Date(utcDate + 'Z').toLocaleDateString('es-CO', {
        weekday: 'long', day: 'numeric', month: 'long',
        timeZone: 'America/Bogota',
    });
}

function formatMobileTime(utcDate: string): string {
    return new Date(utcDate).toLocaleTimeString('es-CO', {
        hour: '2-digit', minute: '2-digit',
        timeZone: 'America/Bogota',
    });
}

function groupByDate(matches: Match[]): Record<string, Match[]> {
    return matches.reduce((acc, m) => {
        const day = m.utcDate.slice(0, 10);
        (acc[day] ??= []).push(m);
        return acc;
    }, {} as Record<string, Match[]>);
}

function MobileMatchCard({ match }: { match?: Match }) {
    const w = match?.score?.winner;
    const homeScore = match?.score?.fullTime?.home;
    const awayScore = match?.score?.fullTime?.away;
    const hasScore = homeScore != null && awayScore != null;

    const teamBlock = (team: Team | undefined, side: 'home' | 'away') => {
        const isWinner = w === (side === 'home' ? 'HOME_TEAM' : 'AWAY_TEAM');
        return (
            <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                {team ? (
                    <>
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-sm border shrink-0 ${isWinner ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'}`}>
                            <img src={team.crest} alt={team.shortName} className="w-8 h-8 object-contain" />
                        </div>
                        <span className={`font-extrabold uppercase text-[11px] text-center leading-tight line-clamp-2 ${isWinner ? 'text-orange-400' : 'text-white'}`}>
                            {teamName(team)}
                        </span>
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 border border-white/10 shrink-0">
                            <div className="w-6 h-6 rounded-full bg-white/20" />
                        </div>
                        <span className="font-semibold uppercase text-[10px] text-white/30 text-center">Por definirse</span>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="w-full bg-[#1a0d05]/80 border border-white/10 rounded-2xl px-4 py-3 space-y-2">
            {/* Stage + tiempo */}
            <div className="flex items-center justify-between">
                <span className="bg-gradient-to-b from-[#FF9900] to-[#EC5406] text-white text-[10px] font-bold uppercase tracking-widest rounded-md px-2.5 py-0.5">
                    {match ? STAGE_LABELS[match.stage] ?? match.stage : '—'}
                </span>
                {match && (
                    <span className="text-white/50 text-[11px] font-semibold">
                        {formatMobileTime(match.utcDate)}
                    </span>
                )}
            </div>

            {/* Equipos + marcador */}
            <div className="flex items-center gap-3">
                {teamBlock(match?.homeTeam, 'home')}

                <div className="flex flex-col items-center shrink-0 gap-0.5">
                    {hasScore ? (
                        <div className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 shadow-sm">
                            <span className={`text-xl font-extrabold tabular-nums ${w === 'HOME_TEAM' ? 'text-orange-500' : 'text-gray-800'}`}>
                                {homeScore}
                            </span>
                            <span className="text-gray-400 font-bold text-base">-</span>
                            <span className={`text-xl font-extrabold tabular-nums ${w === 'AWAY_TEAM' ? 'text-orange-500' : 'text-gray-800'}`}>
                                {awayScore}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 bg-white/10 rounded-xl px-3 py-1.5">
                            <span className="text-white/40 font-bold text-base">vs</span>
                        </div>
                    )}
                </div>

                {teamBlock(match?.awayTeam, 'away')}
            </div>
        </div>
    );
}

// ── Bracket desktop ────────────────────────────────────────────────────────────
function BracketConnector({ count }: { count: number }) {
    return (
        <div className="flex flex-col justify-around w-3 shrink-0 py-1 pr-1">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex flex-col flex-1">
                    <div className="flex-1 border-r border-b border-white/20 rounded-br-sm" />
                    <div className="flex-1 border-r border-t border-white/20 rounded-tr-sm" />
                </div>
            ))}
        </div>
    );
}

function RoundColumn({ stage, matches, totalSlots }: {
    stage: string; matches: Match[]; totalSlots: number;
}) {
    const slots = Array.from({ length: totalSlots }, (_, i) => matches[i]);
    return (
        <div className="flex flex-col" style={{ minWidth: 130 }}>
            <div className="text-center text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">
                {STAGE_LABELS[stage]}
            </div>
            <div className="flex flex-col justify-around flex-1 gap-2">
                {slots.map((match, i) => (
                    <MatchCard key={match?.id ?? `empty-${stage}-${i}`} match={match} />
                ))}
            </div>
        </div>
    );
}

// ── Componente principal ───────────────────────────────────────────────────────
function ClasifiesList() {
    const scale = useBracketScale();
    const competitionId = "2000";
    const conditions = { dateFrom: "2026-06-28", dateTo: "2026-07-19" };
    const [games, setGames] = useState<Match[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        setLoadingData(true);
        ExperienceService.sport.consultMatches(competitionId, conditions)
            .then((res) => { if (res.success) setGames(res.data.matches); })
            .catch(console.error)
            .finally(() => setLoadingData(false));
    }, []);

    if (loadingData) return <LoadingSpinner />;

    const byStage: Record<string, Match[]> = {};
    games.forEach((m) => {
        if (KNOCKOUT_STAGES.includes(m.stage)) (byStage[m.stage] ??= []).push(m);
    });

    // ── Vista móvil: agrupado por fecha ────────────────────────────────────
    if (isMobile) {
        const allKnockout = KNOCKOUT_STAGES.flatMap((s) => byStage[s] ?? []);
        const byDate = groupByDate(allKnockout);
        const sortedDates = Object.keys(byDate).sort();

        return (
            <div className="flex flex-col gap-6 py-4 px-2 w-full">
                {sortedDates.length === 0 ? (
                    <div className="text-white/40 text-sm text-center py-8">
                        Sin partidos de eliminación disponibles aún.
                    </div>
                ) : (
                    sortedDates.map((day) => (
                        <div key={day} className="flex flex-col gap-3">
                            {/* Encabezado de fecha */}
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 rounded-full bg-orange-500 shrink-0" />
                                <span className="text-white font-bold text-sm capitalize">
                                    {formatMobileDate(day)}
                                </span>
                                <div className="flex-1 h-px bg-white/10" />
                            </div>
                            {/* Partidos del día */}
                            <div className="flex flex-col gap-3">
                                {byDate[day].map((match) => (
                                    <MobileMatchCard key={match.id} match={match} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        );
    }

    // ── Vista desktop: bracket horizontal con scale ─────────────────────────
    const leftMatches: Record<string, Match[]> = {};
    const rightMatches: Record<string, Match[]> = {};
    ['LAST_32', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS'].forEach((stage) => {
        const all = byStage[stage] ?? [];
        const half = Math.ceil(all.length / 2);
        leftMatches[stage] = all.slice(0, half);
        rightMatches[stage] = all.slice(half);
    });
    const leftStages = ['LAST_32', 'LAST_16', 'QUARTER_FINALS', 'SEMI_FINALS'];
    const rightStages = [...leftStages].reverse();
    const finalMatch = (byStage['FINAL'] ?? [])[0];
    const thirdMatch = (byStage['THIRD_PLACE'] ?? [])[0];

    return (
        <div className="w-full overflow-hidden flex justify-center py-4">
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', width: BRACKET_WIDTH }}>
                <div className="flex items-stretch gap-0 mx-auto w-fit">

                    {leftStages.map((stage) => (
                        <div key={stage} className="flex items-stretch">
                            <RoundColumn stage={stage} matches={leftMatches[stage] ?? []}
                                totalSlots={STAGE_HALF_COUNT[stage]} />
                            <BracketConnector count={STAGE_HALF_COUNT[stage]} />
                        </div>
                    ))}

                    <div className="flex flex-col items-center justify-center gap-3 px-3" style={{ minWidth: 160 }}>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-white/40">Final</div>
                        <div className="flex w-full justify-center">
                            <MatchCard match={finalMatch} />
                        </div>
                        {thirdMatch && (
                            <>
                                <div className="text-[9px] font-bold uppercase tracking-widest text-white/30 mt-1">3er lugar</div>

                                <MatchCard match={thirdMatch} />
                            </>
                        )}
                    </div>

                    {rightStages.map((stage) => (
                        <div key={stage} className="flex items-stretch flex-row-reverse">
                            <RoundColumn stage={stage} matches={rightMatches[stage] ?? []}
                                totalSlots={STAGE_HALF_COUNT[stage]} />
                            <BracketConnector count={STAGE_HALF_COUNT[stage]} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ClasifiesList;
