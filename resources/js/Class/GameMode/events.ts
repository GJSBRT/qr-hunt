export interface GameEvent {
    name: string;
    action: (...args: any) => void;
}

export class GameEvents {
    public events: GameEvent[] = [];
}
