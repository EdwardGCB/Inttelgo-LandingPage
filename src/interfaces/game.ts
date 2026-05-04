export interface Team {
    id: number;
    name: string;
    shortName: string;
    crest: string;
}

export interface Score {
    fullTime: { home: number | null; away: number | null };
    winner: string | null;
}

export interface Match {
    id: number;
    utcDate: string;
    status: string;
    matchday: number;
    stage: string;
    group: string;
    homeTeam: Team;
    awayTeam: Team;
    score: Score;
}

export interface StandingEntry {
    position: number;
    playedGames: number;
    won: number;
    draw: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    form: string | null;
    team: Team;
}

export interface StandingGroup {
    stage: string;
    type: string;
    group: string;
    table: StandingEntry[];
}

export interface Prediction {
    id: number;
    match: Match;
    homeScore: number;
    awayScore: number;
    points: number;
}