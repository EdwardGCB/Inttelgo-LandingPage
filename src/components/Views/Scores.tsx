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

    if (!user) return;

    if (loadingData) return <LoadingSpinner />;

    if (puntuations.length === 0) {
        return (
            <div className="text-center text-white py-8">
                No hay puntuaciones creadas
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-4">
            <Table>
                <TableHeader>
                    <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="w-20">
                            <div className='bg-gradient-to-b from-[#FF9900] to-[#EC5406] text-white text-center font-bold uppercase tracking-widest rounded-md py-2 px-4'>
                                POSICIÓN
                            </div>
                        </TableHead>
                        <TableHead className="">
                            <div className='bg-gradient-to-b from-[#FF9900] to-[#EC5406] text-white text-center font-bold uppercase tracking-widest rounded-md py-2 px-4'>
                                NOMBRE
                            </div>
                        </TableHead>
                        <TableHead className="w-24">
                            <div className='bg-gradient-to-b from-[#FF9900] to-[#EC5406] text-white text-center font-bold uppercase tracking-widest rounded-md py-2 px-4'>
                                PUNTAJE
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {puntuations.map((item, index) => {
                        const position = index + 1;
                        const isCurrentUser = String(user?.id) === String(item.user);

                        return (
                            <TableRow
                                key={item.id}
                                className="border-none hover:bg-transparent"
                            >
                                <TableCell>
                                    <div className={cn("text-xl text-center font-bold uppercase tracking-widest rounded-md py-2 px-4", isCurrentUser
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-black text-white')}>
                                        {position}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={cn("text-xl text-center font-bold uppercase tracking-widest rounded-md py-2 px-4", isCurrentUser
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-black text-white')}>
                                        {isCurrentUser ? "Tú" : item.name}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={cn("text-xl text-center font-bold uppercase tracking-widest rounded-md py-2 px-4", isCurrentUser
                                        ? 'bg-black text-orange-500'
                                        : 'bg-orange-500 text-white')}>

                                        {item.puntuation}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export default Scores;