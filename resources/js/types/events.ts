import { Game } from "./game";
import { Team } from "./team";

export interface GameStartedEvent {
    game: Game;
};

export interface TeamScore {
    team: Team;
    score: number;
}

export interface TeamWonEvent {
    winningTeamScore: TeamScore;
    teamScores: TeamScore[];
};

export interface LobbyUpdatedEvent {};

