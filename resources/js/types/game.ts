interface DatabaseObject {
    id:         number;
    created_at: string;
    updated_at: string;
};

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
