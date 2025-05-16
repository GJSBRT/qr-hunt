import { GameEvents } from "@/Class/GameMode/events";
import { Game, GameStatePlaying } from "@/types/game";
import { Team } from "@/types/team";
import { TerritoryChallengeArea, TerritoryKoth } from "./types/koth";
import { UseIonToastResult } from "@ionic/react";
import { router } from "@inertiajs/react";
import { Vibrate } from "@/Utils/vibrate";

export class TerritoryEvents extends GameEvents {
    constructor(toast: UseIonToastResult, playNotificationSound: () => void) {
        super();

        const [present] = toast;

        this.events = [
            {
                name: 'KothClaimedEvent',
                channel: (gameState) => `game.${gameState.game.id}`,
                action: (gameState: GameStatePlaying, game: Game, team: Team, koth: TerritoryKoth) => {
                    if (gameState.teamData.team.id == team.id) return;

                    playNotificationSound();
                    Vibrate(100);

                    present({
                        message: `${team.name} heeft een koth punt geclaimed!`,
                        duration: 5000,
                        position: 'top',    
                        color: 'primary',
                    });
                    router.reload();
                }
            },
            {
                name: 'AreaClaimedEvent',
                channel: (gameState) => `game.${gameState.game.id}`,
                action: (gameState: GameStatePlaying, game: Game, team: Team, area: TerritoryChallengeArea) => {
                    if (gameState.teamData.team.id == team.id) return;

                    playNotificationSound();
                    Vibrate(100);

                    present({
                        message: `${team.name} heeft het gebied '${area.name}' geclaimed!`,
                        duration: 5000,
                        position: 'top',    
                        color: 'primary',
                    });
                    router.reload();
                }
            },
            {
                name: 'MissionAnswerIncorrectEvent',
                channel: (gameState) => `team.${gameState.teamPlayer.team_id}`,
                action: (gameState: GameStatePlaying, area: TerritoryChallengeArea) => {
                    playNotificationSound();
                    Vibrate(100);

                    present({
                        message: `Je antwoord voor de opdracht in gebied '${area.name}' was fout`,
                        duration: 10000,
                        position: 'top',    
                        color: 'danger',
                    });
                }
            },
            {
                name: 'TeamTaggedEvent',
                channel: (gameState) => `game.${gameState.game.id}`,
                action: (gameState: GameStatePlaying, byTeam: Team, taggedTeam: Team) => {
                    playNotificationSound();
                    Vibrate(100);

                    present({
                        message: `Team ${taggedTeam.name} is getikt door team ${byTeam.name}`,
                        duration: 10000,
                        position: 'top',    
                        color: 'warning',
                    });
                    router.reload();
                }
            }
        ];
    }
}
