import { GameEvents } from "@/Class/GameMode/events";
import { Game, GameStatePlaying } from "@/types/game";
import { Team } from "@/types/team";
import { TerritoryKoth } from "./types/koth";
import { UseIonToastResult } from "@ionic/react";

export class TerritoryEvents extends GameEvents {
    constructor(toast: UseIonToastResult) {
        super();

        const [present] = toast;

        this.events = [
            {
                name: 'KothClaimedEvent',
                channel: (gameState) => `game.${gameState.game.id}`,
                action: (gameState: GameStatePlaying, game: Game, team: Team, koth: TerritoryKoth) => {
                    if (gameState.teamData.team.id == team.id) return;

                    present({
                        message: `${team.name} heeft een koth punt geclaimed!`,
                        duration: 5000,
                        position: 'top',    
                        color: 'primary',
                    });
                }
            }
        ];
    }
}
