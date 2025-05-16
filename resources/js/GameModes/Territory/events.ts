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
                channel: (game) => `game.${game.id}`,
                action: (gameState: GameStatePlaying|null, game: Game, team: Team, koth: TerritoryKoth) => {
                    if (gameState && gameState.teamData.team.id == team.id) return;

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
                channel: (game) => `game.${game.id}`,
                action: (gameState: GameStatePlaying|null, game: Game, team: Team, area: TerritoryChallengeArea) => {
                    if (gameState && gameState.teamData.team.id == team.id) return;

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
                channel: (game, team) => `team.${team?.id ?? 0}`,
                action: (gameState: GameStatePlaying|null, area: TerritoryChallengeArea) => {
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
                channel: (game) => `game.${game.id}`,
                action: (gameState: GameStatePlaying|null, byTeam: Team|null, taggedTeam: Team) => {
                    playNotificationSound();
                    Vibrate(100);

                    let message = `Team ${taggedTeam.name} is nu de tikker`;
                    if (byTeam) {
                        message = `Team ${taggedTeam.name} is getikt door team ${byTeam.name}`;
                    }

                    present({
                        message: message,
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
