import { router } from "@inertiajs/react";
import { IonChip, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRefresher, IonRefresherContent, IonText, IonTitle, IonToolbar, RefresherEventDetail } from "@ionic/react";

import { GameState } from "@/types/game";
import GameLayout from "@/Layouts/GameLayout";
import { Team, TeamPlayer } from "@/types/team";

import CreateTeamButton from "./Partials/CreateTeamButton";
import SwitchToTeamButton from "./Partials/SwitchToTeamButton";
import PlayerList from "./Partials/PlayerList";

interface Props {
    gameState: GameState;
    teamPlayers: Array<TeamPlayer & {
        team: Team;
    }>;
}

export default function Lobby({ gameState, teamPlayers }: Props) {
    const handleRefresh = function (event: CustomEvent<RefresherEventDetail>) {
        router.reload({
            onFinish: () => event.detail.complete(),
        });
    };

    return (
        <GameLayout title='Lobby' gameState={gameState}>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{gameState.game.name}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>

                    <IonList lines='full'>
                        <IonItem>
                            <IonLabel>
                                <IonText>
                                    Welkom{gameState.teamPlayer && ` ${gameState.teamPlayer.name}`} in de lobby.
                                    {(gameState.game.status == 'not_started' && ' Het spel is nog niet begonnen. ')}
                                    {(gameState.game.status == 'started' && ' Het spel is al begonnen. ')}
                                    {' '}Selecteer een team om aan mee toe doen.
                                </IonText>
                            </IonLabel>
                        </IonItem>

                        <IonItem>
                            <IonLabel>Spel code</IonLabel>
                            <IonLabel slot='end'>{gameState.game.code}</IonLabel>
                        </IonItem>

                        <PlayerList teamPlayers={teamPlayers} />
                    </IonList>

                    <IonList lines="full">
                        <IonListHeader>
                            <IonLabel>Teams</IonLabel>
                            <CreateTeamButton gameState={gameState} />
                        </IonListHeader>

                        {gameState.teams.map(team => (
                            <IonItem key={team.id}>
                                <IonLabel>
                                    {team.name} ({team.player_count} spelers) {(gameState.teamPlayer && (team.id == gameState.teamPlayer.team_id)) && <IonChip style={{ marginTop: '-0.25rem', marginBottom: '-0.25rem' }} color="success">Jouw team</IonChip>}
                                </IonLabel>

                                {(!gameState.teamPlayer || (gameState.teamPlayer && (team.id != gameState.teamPlayer.team_id))) && <SwitchToTeamButton team={team} gameState={gameState} />}
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </IonPage>
        </GameLayout>
    );
};
