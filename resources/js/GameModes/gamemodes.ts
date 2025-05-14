import { GameMap } from "@/Class/GameMode/map";
import { TerritoryMap } from "./Territory/map";

interface GameModesInterface {
    [key: string]: {
        map?: typeof GameMap;
    }
}

const GameModes: GameModesInterface = {
    territory: {
        map: TerritoryMap
    },
}

export default GameModes;
