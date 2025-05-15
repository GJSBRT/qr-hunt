import { GameStatePlaying } from "@/types/game";

export interface GameEvent {
    name: string;
    channel: (gameState: GameStatePlaying) => string;
    action: (gameState: GameStatePlaying, ...args: any) => void;
}

export class GameEvents {
    public events: GameEvent[] = [];

    constructor(...args: any) {}
}
