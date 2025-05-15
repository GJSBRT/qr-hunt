import { GameEvents } from "@/Class/GameMode/events";
import { Game, GameStatePlaying } from "@/types/game";
import { Team } from "@/types/team";
import { TerritoryChallengeArea, TerritoryKoth } from "./types/koth";
import { UseIonToastResult } from "@ionic/react";
import { TerritoryMissionAnswer } from "./types/mission";

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
            },
            {
                name: 'AreaClaimedEvent',
                channel: (gameState) => `game.${gameState.game.id}`,
                action: (gameState: GameStatePlaying, game: Game, team: Team, area: TerritoryChallengeArea) => {
                    if (gameState.teamData.team.id == team.id) return;

                    present({
                        message: `${team.name} heeft het gebied '${area.name}' geclaimed!`,
                        duration: 5000,
                        position: 'top',    
                        color: 'primary',
                    });
                }
            },
            {
                name: 'MissionAnswerIncorrectEvent',
                channel: (gameState) => `team.${gameState.teamPlayer.team_id}`,
                action: (gameState: GameStatePlaying, area: TerritoryChallengeArea) => {
                    present({
                        message: `Je antwoord voor de opdracht in gebied '${area.name}' was fout`,
                        duration: 10000,
                        position: 'top',    
                        color: 'danger',
                    });
                }
            }
        ];
    }
}
