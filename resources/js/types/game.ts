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
    start_lat: number | null;
    start_lng: number | null;
    quartet_categories: number;
    quartet_values: number;
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

export interface GameState {
    game: Game & {
        game_map_area_points: GameMapAreaPoint[];
    };
    team: Team | null;
    teamPlayer: TeamPlayer | null;
    teams: Team[];
    scanFreeze: TeamScanFreeze[] | null;
    powerAppliedTeamQRCodes: Array<TeamQRCode & {
        power: Power;
    }> | null;
};

export interface GameStatePlaying extends GameState {
    team: Team;
    teamPlayer: TeamPlayer;
    teamQrCodes: Array<TeamQRCode & {
        qr_code: QRCode;
        power: Power | null;
        quartet: Quartet | null;
        team_player: TeamPlayer | null;
    }>;
    quartets: {
        [key: string]: {
            color: string;
            label: string;
            cards: number[];
        }
    };
    scanFreeze: TeamScanFreeze[];
    powerAppliedTeamQRCodes: Array<TeamQRCode & {
        power: Power;
    }>
};
