import { Game, GameStatePlaying } from "@/types/game";
import { Team } from "@/types/team";

export interface GameEvent {
    name: string;
    channel: (game: Game, team: Team|null) => string;
    action: (gameState: GameStatePlaying|null, ...args: any) => void;
}

export class GameEvents {
    public events: GameEvent[] = [];

    constructor(...args: any) {}
}
