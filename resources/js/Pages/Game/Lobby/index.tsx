import { router } from "@inertiajs/react";
import { IonChip, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRefresher, IonRefresherContent, IonText, IonTitle, IonToolbar, RefresherEventDetail } from "@ionic/react";

import { GameState } from "@/types/game";
import GameLayout from "@/Layouts/GameLayout";

import CreateTeamButton from "./Partials/CreateTeamButton";
import SwitchToTeamButton from "./Partials/SwitchToTeamButton";

interface Props {
    gameState: GameState;
}

export default function Lobby({ gameState }: Props) {
    const handleRefresh = function (event: CustomEvent<RefresherEventDetail>) {
        router.reload({
            onFinish: () => event.detail.complete(),
        });
    }

    return (
        <GameLayout title='Lobby'>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{gameState.game.name}</IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="ion-padding">
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>

                    <IonItem>
                        <IonLabel>
                            <IonText>
                                Welkom{gameState.teamPlayer && ` ${gameState.teamPlayer.name}`} in de lobby.
                                {(gameState.game.status == 'not_started' && ' Het spel is nog niet begonnen. ')}
                                {(gameState.game.status == 'started' && ' Het spel is al begonnen. ')}
                                Selecteer een team om aan mee toe doen.
                            </IonText>
                            <br/><br/>
                            <IonText>Spel code: {gameState.game.code}</IonText>
                        </IonLabel>
                    </IonItem>

                    <IonList>
                        <IonListHeader>
                            <IonLabel>Teams</IonLabel>
                            <CreateTeamButton gameState={gameState} />
                        </IonListHeader>

                        {gameState.teams.map(team => (
                            <IonItem key={team.id}>
                                <IonLabel>
                                    {team.name} {(gameState.teamPlayer && (team.id == gameState.teamPlayer.team_id)) && <IonChip color="success">Jouw team</IonChip>}
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
