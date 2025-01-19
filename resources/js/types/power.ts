import { DatabaseObject } from ".";

export interface Power extends DatabaseObject {
    game_id: number;
    power_up: boolean;
    description: string|null;
    related_to_other_team: boolean;
    type: 'message';
    extra_fields: { [key: string]: string }
};

export type NewPower = Omit<Power, 'game_id' | keyof DatabaseObject>;
