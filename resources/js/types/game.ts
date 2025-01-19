import { DatabaseObject } from ".";
import { Power } from "./power";
import { QRCode, TeamQRCode } from "./qr_code";
import { Quartet } from "./quartet";
import { Team, TeamPlayer } from "./team";

export interface Game extends DatabaseObject {
    user_id: number;
    name: string;
    code: string;
    status: 'draft' | 'not_started' | 'started' | 'ended';
    started_at: string | null;
    ended_at: string | null;
    play_duration: number | null;
    cooldown_duration: number | null;
    start_lat: number | null;
    start_lng: number | null;
    quartet_categories: number;
    quartet_values: number;
};

export type NewGame = Omit<Game, 'user_id' | 'status' | 'started_at' | 'ended_at' | keyof DatabaseObject>;

export const GAME_STATUS_LANGUAGE = {
    'draft': "Schets",
    'not_started': "Nog niet gestart",
    'started': "Begonnned",
    'ended': "Afgelopen",
};

export interface GameState {
    game: Game;
    team: Team | null;
    teamPlayer: TeamPlayer | null;
    teams: Team[];
};

export interface GameStatePlaying extends GameState {
    team: Team;
    teamPlayer: TeamPlayer;
    teamQrCodes: Array<TeamQRCode & {
        qr_code: QRCode;
        power: Power;
        quartet: Quartet;
        team_player: TeamPlayer | null;
    }>;
    quartets: {
        [key: string]: {
            color: string;
            label: string;
            cards: number[];
        }
    }
};
