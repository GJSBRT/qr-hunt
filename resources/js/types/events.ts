import { Game } from "./game";

export interface GameStartedEvent {
    game: Game;
};

export interface TeamQRCodeTransferredEvent {
    from_team_id: number;
    to_team_id: number;
};
