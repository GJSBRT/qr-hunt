import { DatabaseObject } from "@/types";

export interface Territory extends DatabaseObject {
    game_id: number;
    points_per_claimed_area: number;
    start_lat: number;
    start_lng: number;
}
