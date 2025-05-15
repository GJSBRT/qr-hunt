import { GameEvents } from "@/Class/GameMode/events";
import { Game } from "@/types/game";
import { Team } from "@/types/team";
import { TerritoryKoth } from "./types/koth";

export class TerritoryEvents extends GameEvents {
    constructor() {
        super();

        this.events = [
            {
                name: 'KothClaimedEvent',
                action: (game: Game, team: Team, koth: TerritoryKoth) => {
                    console.log("KothClaimedEvent")
                }
            }
        ];
    }
}