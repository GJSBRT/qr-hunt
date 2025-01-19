import { DatabaseObject } from ".";
import { Team } from "./team";

export interface QRCode extends Omit<DatabaseObject, 'id'> {
    uuid: string;
    game_id: number;
    description: string;
    max_scans: number|null;
    location_lat: number|null;
    location_lng: number|null;
};

export type NewQRCode = Omit<QRCode, 'game_id' | 'location_lat'| 'location_lng' | 'uuid' | keyof Omit<DatabaseObject, 'id'>>;

export interface TeamQRCode extends DatabaseObject {
    qr_code_uuid: string;
    team_id: number;
    team_player_id: number|null;
    power_used_at: string|null;
    transferred_from_team: Team|null;
};
