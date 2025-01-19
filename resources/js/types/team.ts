import { DatabaseObject } from ".";

export interface Team extends DatabaseObject {
    game_id:        number;
    name:           string;
    player_count:   number;
};

export interface TeamPlayer extends DatabaseObject {
    team_id: number;
    name:    string;
};
