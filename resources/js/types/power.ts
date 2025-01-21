import { DatabaseObject } from ".";

export interface Power extends DatabaseObject {
    game_id: number;
    power_up: boolean;
    description: string|null;
    related_to_other_team: boolean;
    type: 'message' | 'wildcard' | 'qr_location_hint' | 'scan_freeze' | 'return_to_start' | 'give_qr_to_another_team';
    extra_fields: { [key: string]: string }
};

export type NewPower = Omit<Power, 'game_id' | keyof DatabaseObject>;

export const POWER_TYPE_LANGUAGE = {
    message: 'Bericht',
    wildcard: 'Joker kaart',
    qr_location_hint: 'QR locatie hint',
    scan_freeze: 'Scan freeze',
    return_to_start: 'Keer terug naar start',
    give_qr_to_another_team: 'Geef een QR code aan een ander team',
};
