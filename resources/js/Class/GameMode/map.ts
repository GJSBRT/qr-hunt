import { GameMapArea } from "@/types/game";

export interface GameMapAreaActions {
    type: 'in_zone'
    element: (zone: GameMapArea) => JSX.Element;
}

export class GameMap {
    public areaActions: GameMapAreaActions[] = [];
}
