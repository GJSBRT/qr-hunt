import { GameMapArea, GameStatePlaying } from "@/types/game";

export interface GameMapAreaActionElementProps {
    area: GameMapArea;
    gameState: GameStatePlaying;
}

export interface GameMapAreaAction {
    type: 'in_zone'
    element: ({area, gameState}: GameMapAreaActionElementProps) => JSX.Element;
}

export class GameMap {
    public areaActions: GameMapAreaAction[] = [];
}
