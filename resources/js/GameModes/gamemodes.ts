import { GameMap } from "@/Class/GameMode/map";
import { TerritoryMap } from "./Territory/map";
import { GameEvents } from "@/Class/GameMode/events";
import { TerritoryEvents } from "./Territory/events";

interface GameModesInterface {
    [key: string]: {
        label: string;
        map?: typeof GameMap;
        events?: typeof GameEvents;
    }
}

const GameModes: GameModesInterface = {
    territory: {
        label: 'Territory',
        map: TerritoryMap,
        events: TerritoryEvents
    },
}

export default GameModes;
