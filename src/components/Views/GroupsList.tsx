import ExperienceService from '@/services/ExperienceService';
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { StandingGroup } from '@/interfaces/game';
import { Card, CardContent } from '@/components/ui/card';

// Selecciones clasificadas al Mundial 2026
const TEAM_NAMES: Record<string, string> = {
    // CONCACAF
    "Mexico": "México", "Canada": "Canadá", "USA": "EE.UU.", "United States": "EE.UU.",
    "Panama": "Panamá", "Costa Rica": "Costa Rica", "Honduras": "Honduras", "Jamaica": "Jamaica",
    // CONMEBOL
    "Argentina": "Argentina", "Brazil": "Brasil", "Colombia": "Colombia", "Uruguay": "Uruguay",
    "Ecuador": "Ecuador", "Venezuela": "Venezuela", "Paraguay": "Paraguay", "Chile": "Chile",
    "Bolivia": "Bolivia", "Peru": "Perú",
    // UEFA
    "France": "Francia", "Spain": "España", "England": "Inglaterra", "Germany": "Alemania",
    "Netherlands": "Holanda", "Portugal": "Portugal", "Belgium": "Bélgica", "Croatia": "Croacia",
    "Switzerland": "Suiza", "Czechia": "Chequia", "Austria": "Austria", "Scotland": "Escocia",
    "Turkey": "Türkiye", "Ukraine": "Ucrania", "Serbia": "Serbia", "Denmark": "Dinamarca",
    "Norway": "Noruega", "Romania": "Rumanía", "Hungary": "Hungría", "Slovakia": "Eslovaquia",
    "Slovenia": "Eslovenia", "Albania": "Albania", "Georgia": "Georgia", "Iceland": "Islandia",
    "Ireland": "Irlanda", "Wales": "Gales", "Greece": "Grecia", "Finland": "Finlandia",
    "Sweden": "Suecia", "Poland": "Polonia", "Bosnia-Herzegovina": "Bosnia-Herz.",
    // CAF
    "Morocco": "Marruecos", "Egypt": "Egipto", "Nigeria": "Nigeria", "Cameroon": "Camerún",
    "South Africa": "Sudáfrica", "Ghana": "Ghana", "Senegal": "Senegal", "Algeria": "Argelia",
    "Mali": "Malí", "Angola": "Angola", "Congo DR": "R.D. Congo", "Tunisia": "Túnez",
    "Ivory Coast": "Costa de Marfil",
    // AFC
    "Japan": "Japón", "Korea Republic": "Corea del Sur", "Iran": "Irán", "Australia": "Australia",
    "Saudi Arabia": "Arabia Saudita", "Jordan": "Jordania", "Uzbekistan": "Uzbekistán",
    "China PR": "China", "Indonesia": "Indonesia", "Iraq": "Irak", "Qatar": "Catar",
    "Kuwait": "Kuwait", "Bahrain": "Baréin", "Oman": "Omán",
    "UAE": "Emiratos Árabes", "United Arab Emirates": "Emiratos Árabes",
    // OFC
    "New Zealand": "Nueva Zelanda", "New Caledonia": "Nueva Caledonia",
    // CONCACAF adicional
    "Curaçao": "Curazao", "Haiti": "Haití",
};

const GROUP_LABELS: Record<string, { label: string; letter: string }> = {
    "Group A": { label: "Grupo", letter: "A" },
    "Group B": { label: "Grupo", letter: "B" },
    "Group C": { label: "Grupo", letter: "C" },
    "Group D": { label: "Grupo", letter: "D" },
    "Group E": { label: "Grupo", letter: "E" },
    "Group F": { label: "Grupo", letter: "F" },
    "Group G": { label: "Grupo", letter: "G" },
    "Group H": { label: "Grupo", letter: "H" },
    "Group I": { label: "Grupo", letter: "I" },
    "Group J": { label: "Grupo", letter: "J" },
    "Group K": { label: "Grupo", letter: "K" },
    "Group L": { label: "Grupo", letter: "L" },
};

// Paleta oficial FIFA World Cup 2026
const GROUP_COLORS: Record<string, string> = {
    "Group A": "#7B1822",
    "Group B": "#6B00B3",
    "Group C": "#1E2D6B",
    "Group D": "#0C3D3D",
    "Group E": "#CC0000",
    "Group F": "#9966CC",
    "Group G": "#2244BB",
    "Group H": "#00AA33",
    "Group I": "#FF4400",
    "Group J": "#CC2266",
    "Group K": "#00BBAA",
    "Group L": "#AACC00",
};

function GroupsList() {
    const competitionId = "2000"
    const [groups, setGroups] = useState<StandingGroup[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        setLoadingData(true);
        ExperienceService.sport.consultStandings(competitionId, { stage: "All" }).then((res) => {
            if (res.success) {
                setGroups(res.data[0].standings)
            }
        }).catch((e) => {
            console.error(e);
        }).finally(() => setLoadingData(false))
    }, [])

    if (loadingData)
        return <LoadingSpinner />

    return (
        <div className="w-full px-2 sm:px-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 p-2">
                {groups.map((group) => {
                    const color = GROUP_COLORS[group.group] ?? "#1E2D6B";
                    const meta = GROUP_LABELS[group.group] ?? { label: "Grupo", letter: "?" };

                    return (
                        <Card
                            key={group.group}
                            className="border-0 shadow-none overflow-hidden rounded-2xl bg-transparent p-0"
                        >
                            <CardContent className="px-3 pb-3 flex flex-col gap-2">
                                <div className="inline-flex self-start items-center bg-gradient-to-b from-[#305CDE]/20 to-[#000080] rounded-xl rounded-tr-none rounded-bl-none h-10 sm:h-12 relative px-3 sm:px-4">
                                    <span className="text-primary-foreground font-extrabold uppercase tracking-widest text-xs sm:text-sm">
                                        Grupo{" "}
                                        <span style={{ color }}>
                                            <span
                                                className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white font-extrabold text-xs sm:text-sm shrink-0"
                                                style={{ backgroundColor: color }}
                                            >
                                                {meta.letter}
                                            </span>
                                        </span>
                                    </span>
                                </div>

                                {group.table.map((entry) => (
                                    <div
                                        key={entry.team.id}
                                        className="flex items-center bg-white rounded-xl rounded-tl-none rounded-br-none h-10 sm:h-12 relative ml-4"
                                    >
                                        <div className="absolute -left-4 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 bg-white rounded-xl rounded-tl-none shadow-md border border-gray-100">
                                            <img
                                                src={entry.team.crest}
                                                alt={entry.team.shortName}
                                                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                                            />
                                        </div>
                                        <span className="text-gray-400 font-bold text-xs pl-10 sm:pl-12 pr-2 shrink-0">
                                            {entry.position}
                                        </span>
                                        <span className="text-left text-gray-900 font-extrabold uppercase tracking-tight sm:tracking-widest text-xs sm:text-sm flex-1 truncate">
                                            {TEAM_NAMES[entry.team.name] ?? TEAM_NAMES[entry.team.shortName] ?? entry.team.name}
                                        </span>
                                        <span className="text-xs font-extrabold pr-2 sm:pr-3 shrink-0" style={{ color }}>
                                            {entry.points} pts
                                        </span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}

export default GroupsList
