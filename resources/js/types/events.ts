import { Game } from "./game";
import { Power } from "./power";
import { Team } from "./team";

export interface GameStartedEvent {
    game: Game;
};

export interface TeamQRCodeTransferredEvent {
    from_team_id: number;
    to_team_id: number;
};

export interface TeamWonEvent {
    winningTeam: Team;
    results: null | Array<{
        team: Team;
        points: number;
    }>;
};

export interface LobbyUpdatedEvent {};

export interface PowerActivatedEvent {
    power: Power;
    fromTeam: Team|null;
};
