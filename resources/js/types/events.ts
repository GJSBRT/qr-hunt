import { Game } from "./game";
import { Power } from "./power";
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

export interface PowerActivatedEvent {
    power: Power;
    fromTeam: Team|null;
};
