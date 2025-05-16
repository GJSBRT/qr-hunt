import { GameMap } from "@/Class/GameMode/map";
import { TerritoryMap } from "./Territory/map";
import { GameEvents } from "@/Class/GameMode/events";
import { TerritoryEvents } from "./Territory/events";
import { GameMaster } from "@/Class/GameMode/game_master";
import { TerritoryGameMaster } from "./Territory/game_master";
import { GameFab } from "@/Class/GameMode/fab";
import { TerritoryFab } from "./Territory/fab";

interface GameModesInterface {
    [key: string]: {
        label: string;
        map?: typeof GameMap;
        events?: typeof GameEvents;
        game_master?: typeof GameMaster;
        fab?: typeof GameFab;
    }
}

const GameModes: GameModesInterface = {
    territory: {
        label: 'Territory',
        map: TerritoryMap,
        events: TerritoryEvents,
        game_master: TerritoryGameMaster,
        fab: TerritoryFab
    },
}

export default GameModes;
