import { DatabaseObject } from ".";

export interface Team extends DatabaseObject {
    game_id:    number;
    name:       string;
};

export interface TeamPlayer extends DatabaseObject {
    team_id: number;
    name:    string;
};

export type NewTeamPlayer = Omit<TeamPlayer, 'team_id' | keyof DatabaseObject>;
