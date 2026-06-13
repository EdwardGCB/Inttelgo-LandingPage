import ExperienceService from '@/services/ExperienceService';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUser } from '@/contexts/User';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

type UserScoreRow = {
    id: string | number;
    user: string | number;
    name: string;
    puntuation: number;
};

function Scores() {
    const { user } = useUser();
    const [puntuations, setPuntuations] = useState<UserScoreRow[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (user) {
            ExperienceService.sport
                .consultUsersScores({ limit: 10 })
                .then((res) => {
                    if (res.success && Array.isArray(res.data)) {
                        const rows = res.data as UserScoreRow[];
                        const top10 = [...rows]
                            .sort((a, b) => b.puntuation - a.puntuation)
                            .slice(0, 10);
                        setPuntuations(top10);
                    }
                })
                .catch((e) => console.error(e))
                .finally(() => setLoadingData(false));
        }
    }, [user]);

    if (!user) return null;

    if (loadingData) return (
        <div className="flex justify-center py-16">
            <LoadingSpinner />
        </div>
    );

    if (puntuations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Trophy className="w-10 h-10 text-white/20" />
                <p className="text-white/50 text-sm">
                    Aún no hay puntuaciones registradas
                </p>
            </div>
        );
    }

    const leader = puntuations[0];
    const rest = puntuations.slice(1);
    const isLeaderMe = String(user?.id) === String(leader.user);

    return (
        <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6">

            {/* Título */}
            <div className="flex items-center gap-2.5 mb-5 sm:mb-7">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#FF9900] to-[#EC5406]" />
                <h2 className="text-white font-bold text-base sm:text-xl tracking-tight">
                    Tabla de líderes
                </h2>
            </div>

            {/* ── MÓVIL: tarjetas ─────────────────────────────────────────── */}
            <div className="sm:hidden space-y-1.5">

                {/* Ganador */}
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className={cn(
                        'relative overflow-hidden rounded-2xl mb-3',
                        'border border-[#FF9900]/40',
                        'bg-gradient-to-br from-[#FF9900]/25 via-[#EC5406]/15 to-transparent',
                        'px-4 py-4',
                    )}
                >
                    <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full
                                    bg-[#FF9900]/10 blur-2xl pointer-events-none" />
                    <div className="relative flex items-center gap-3">
                        <div className="shrink-0 w-11 h-11 rounded-xl
                                        bg-gradient-to-br from-[#FF9900] to-[#EC5406]
                                        flex items-center justify-center shadow-lg shadow-[#FF9900]/30">
                            <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-medium text-[#FF9900]/70
                                          uppercase tracking-widest mb-0.5">
                                1er lugar
                            </p>
                            <p className={cn(
                                'font-bold truncate tracking-wide text-base',
                                isLeaderMe ? 'text-[#FF9900]' : 'text-white',
                            )}>
                                {isLeaderMe ? 'Tú' : leader.name}
                            </p>
                        </div>
                        <p className="shrink-0 text-2xl font-black tabular-nums
                                      text-[#FF9900] leading-none">
                            {leader.puntuation.toLocaleString()}
                        </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-px
                                    bg-gradient-to-r from-transparent via-[#FF9900]/40 to-transparent" />
                </motion.div>

                {/* Resto — filas compactas */}
                {rest.map((item, index) => {
                    const position = index + 2;
                    const isCurrentUser = String(user?.id) === String(item.user);
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.22, delay: 0.1 + index * 0.04, ease: 'easeOut' }}
                            className={cn(
                                'relative flex items-center gap-3',
                                'rounded-xl px-3 py-2 border transition-colors duration-150',
                                isCurrentUser
                                    ? 'bg-[#FF9900]/10 border-[#FF9900]/25'
                                    : 'bg-white/[0.03] border-white/5',
                            )}
                        >
                            {isCurrentUser && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2
                                                w-0.5 h-2/3 rounded-full
                                                bg-gradient-to-b from-[#FF9900] to-[#EC5406]" />
                            )}
                            <span className="shrink-0 w-6 text-center text-xs font-bold
                                             tabular-nums text-white/30">
                                {position}
                            </span>
                            <p className={cn(
                                'flex-1 min-w-0 truncate font-semibold text-sm tracking-wide',
                                isCurrentUser ? 'text-[#FF9900]' : 'text-white/70',
                            )}>
                                {isCurrentUser ? 'Tú' : item.name}
                            </p>
                            <span className={cn(
                                'shrink-0 tabular-nums font-bold text-sm',
                                isCurrentUser ? 'text-[#FF9900]' : 'text-white/40',
                            )}>
                                {item.puntuation.toLocaleString()}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── DESKTOP: tabla original estilizada ──────────────────────── */}
            <div className="hidden sm:block">
                <Table>
                    <TableHeader>
                        <TableRow className="border-none hover:bg-transparent">
                            <TableHead className="w-28 pb-3">
                                <div className="bg-gradient-to-b from-[#FF9900] to-[#EC5406]
                                                text-white text-center font-bold uppercase
                                                tracking-widest rounded-md py-2 px-4">
                                    POSICIÓN
                                </div>
                            </TableHead>
                            <TableHead className="pb-3">
                                <div className="bg-gradient-to-b from-[#FF9900] to-[#EC5406]
                                                text-white text-center font-bold uppercase
                                                tracking-widest rounded-md py-2 px-4">
                                    NOMBRE
                                </div>
                            </TableHead>
                            <TableHead className="w-28 pb-3">
                                <div className="bg-gradient-to-b from-[#FF9900] to-[#EC5406]
                                                text-white text-center font-bold uppercase
                                                tracking-widest rounded-md py-2 px-4">
                                    PUNTAJE
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {puntuations.map((item, index) => {
                            const position = index + 1;
                            const isCurrentUser = String(user?.id) === String(item.user);
                            const isWinner = position === 1;

                            return (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.22,
                                        delay: index * 0.05,
                                        ease: 'easeOut',
                                    }}
                                    className="border-none hover:bg-transparent"
                                >
                                    <TableCell className="py-1.5">
                                        <div className={cn(
                                            'text-xl text-center font-bold uppercase',
                                            'tracking-widest rounded-md py-2 px-4',
                                            'flex items-center justify-center gap-2',
                                            isCurrentUser
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-black text-white',
                                        )}>
                                            {isWinner && (
                                                <Trophy className="w-4 h-4 text-yellow-400 shrink-0" />
                                            )}
                                            {position}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-1.5">
                                        <div className={cn(
                                            'text-xl text-center font-bold uppercase',
                                            'tracking-widest rounded-md py-2 px-4',
                                            isCurrentUser
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-black text-white',
                                        )}>
                                            {isCurrentUser ? 'Tú' : item.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-1.5">
                                        <div className={cn(
                                            'text-xl text-center font-bold uppercase',
                                            'tracking-widest rounded-md py-2 px-4',
                                            isCurrentUser
                                                ? 'bg-black text-orange-500'
                                                : 'bg-orange-500 text-white',
                                        )}>
                                            {item.puntuation.toLocaleString()}
                                        </div>
                                    </TableCell>
                                </motion.tr>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

        </div>
    );
}

export default Scores;