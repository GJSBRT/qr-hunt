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

export interface TeamPointsModifier extends DatabaseObject {
    team_id: number;
    type: 'add' | 'remove';
    amount: number
};

export type NewTeamPointsModifier = Omit<TeamPointsModifier, 'team_id' | keyof DatabaseObject>;
