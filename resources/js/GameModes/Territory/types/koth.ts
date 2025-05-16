import { DatabaseObject } from "@/types";
import { GameMapArea } from "@/types/game";
import { Team } from "@/types/team";
import { TerritoryMission, TerritoryMissionMultipleChoiceAnswer } from "./mission";

export interface TerritoryKoth extends DatabaseObject {
    territory_id: number;
    lat: number;
    lng: number;
}

export interface TerritoryKothClaim extends DatabaseObject {
    territory_koth_id: number;
    claim_team_id: number;
    claimed_at: string;
}

export interface TerritoryKothArea extends GameMapArea {
    metadata: {
        claimed_by_team: TerritoryKothClaim & {
            team: Team;
        };
    };
}

export interface TerritoryChallengeArea extends GameMapArea {
    metadata: {
        claimed_by_team: Team|null;
        mission: null|(TerritoryMission & {
            multiple_choices: TerritoryMissionMultipleChoiceAnswer[];
        });
    };
}
