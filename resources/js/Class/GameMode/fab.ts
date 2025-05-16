import { GameStatePlaying } from "@/types/game";

export interface GameFabAction {
    element: ({ gameState }: { gameState: GameStatePlaying }) => JSX.Element;
}

export class GameFab {
    public actions: GameFabAction[] = [];

    constructor(...args: any) { }
}
