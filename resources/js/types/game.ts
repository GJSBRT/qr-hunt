import { DatabaseObject } from ".";
import { Team, TeamPlayer } from "./team";

export interface Game extends DatabaseObject {
    user_id:    number;
    name:       string;
    code:       string;
    status:     'not_started' | 'started' | 'ended';
    started_at: string|null;
    ended_at:   string|null;
};

export const GAME_STATUS_LANGUAGE = {
    'not_started': "Nog niet gestart",
    'started': "Begonnned",
    'ended': "Afgelopen",
};

export interface GameState {
    game:       Game;
    teamPlayer: TeamPlayer|null;
    teams:      Team[];
};
