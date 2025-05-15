import { LatLngExpression, LatLngLiteral } from "leaflet";
import { DatabaseObject } from ".";
import { Power } from "./power";
import { QRCode, TeamQRCode } from "./qr_code";
import { Quartet } from "./quartet";
import { Team, TeamPlayer, TeamScanFreeze } from "./team";

export interface Game extends DatabaseObject {
    user_id: number;
    name: string;
    code: string;
    status: 'draft' | 'not_started' | 'starting' | 'started' | 'ended';
    started_at: string | null;
    ended_at: string | null;
    play_duration: number | null;
    cooldown_duration: number | null;
    show_results: boolean;
};

export type NewGame = Omit<Game, 'user_id' | 'status' | 'starting' | 'started_at' | 'ended_at' | keyof DatabaseObject>;

export const GAME_STATUS_LANGUAGE = {
    'draft': "Schets",
    'not_started': "Nog niet gestart",
    'starting': "Spel begint",
    'started': "Begonnen",
    'ended': "Afgelopen",
};

export interface GameMapAreaPoint extends DatabaseObject {
    game_id: number;
    lat: number;
    lng: number;
};

export type NewGameMapAreaPoint = Omit<GameMapAreaPoint, 'game_id' | keyof DatabaseObject>;

export interface GameMapArea {
    id: string;
    geoLocations: LatLngLiteral[];
    name: string;
    displayName: boolean;
    color: string;
    type: 'polygon' | 'circle';
    radius: number;
    opacity: number;
    gameType: string;
    metadata: any
}

export interface GameMap {
    showPlayerLocation: boolean;
    playerLocationColor: string;
    shareLocationDataToServer: boolean;
    startLocationMarker: LatLngLiteral|null;
    areas: GameMapArea[];
}

export interface GamePower {
    id: number;
    game_id: number;
    owner_team_id: number|null;
    used_on_team_id: number|null;
    taken_from_team_id: number|null;
    power_up: boolean;
    description: string;
    applies_to_other_team: 'no_action' | 'message' | 'give_power_to_another_team' | 'receive_power_from_team' | 'take_power_from_team' | 'return_to_start';
    extra_fields: object;
    claimed_at: string;
    used_at: string;
}

export interface GameMode {
    gameMode: string;
    gameMap: GameMap|null;
    gamePowers: GamePower[]|null;
    gameDescriptionHtml: string;
};

export interface TeamData {
    team: Team;
    gamePowers: GamePower[]|null;
}

export interface GameState {
    game: Game;
    gameMode: GameMode;
    teamPlayer: TeamPlayer | null;
    teams: Team[];
};

export interface GameStatePlaying extends GameState {
    teamPlayer: TeamPlayer;
    teamData: TeamData;
};
