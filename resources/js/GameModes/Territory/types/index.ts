import { DatabaseObject } from "@/types";
import { GameStatePlaying, TeamData } from "@/types/game";

export interface Territory extends DatabaseObject {
    game_id: number;
    points_per_claimed_area: number;
    start_lat: number;
    start_lng: number;
}

export interface TerritoryGameStatePlaying extends Omit<GameStatePlaying, 'teamData'> {
    teamData: TeamData & {
        isTagged: boolean;
    };
}
