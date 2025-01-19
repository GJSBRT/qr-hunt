import { GameStatePlaying } from "@/types/game";
import { IonChip, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from "@ionic/react";

export default function Powers({ gameState }: { gameState: GameStatePlaying }) {
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Powerups</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonList>
                    <IonItem>
                        <IonLabel>Jouw naam</IonLabel>
                        <IonLabel slot='end'>{gameState.teamPlayer.name}</IonLabel>
                    </IonItem>

                    <IonItem detail={true}>
                        <IonLabel>Team</IonLabel>
                        <IonLabel slot='end'>{gameState.team.name}</IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Tijd over</IonLabel>
                        <IonLabel slot='end'>
                            {(gameState.game.status == 'not_started') && <IonChip color='light'>Nog niet begonnen</IonChip>}
                            {(gameState.game.status == 'started') && 'TODO:'}
                            {(gameState.game.status == 'ended') && <IonChip color='danger'>Afgelopen</IonChip>}
                        </IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Spel code</IonLabel>
                        <IonLabel slot='end'>{gameState.game.code}</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </>
    );
};
