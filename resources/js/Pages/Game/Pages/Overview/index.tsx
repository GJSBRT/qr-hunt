import { GameStatePlaying } from "@/types/game";
import { IonChip, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from "@ionic/react";
import moment from "moment";
import Countdown from "react-countdown";

export default function Overview({ gameState }: { gameState: GameStatePlaying }) {
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Overzicht</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonList lines='full'>
                    <IonItem>
                        <IonLabel>Jouw naam</IonLabel>
                        <IonLabel slot='end'>{gameState.teamPlayer.name}</IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Team</IonLabel>
                        <IonLabel slot='end'>{gameState.team.name}</IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Tijd over</IonLabel>
                        <IonLabel slot='end'>
                            {(gameState.game.status == 'draft') && <IonChip>Spel is nog in schets</IonChip>}
                            {(gameState.game.status == 'not_started') && <IonChip color='secondary'>Nog niet begonnen</IonChip>}
                            {(gameState.game.status == 'started') && <Countdown date={moment(gameState.game.started_at).add(gameState.game.play_duration, 'seconds').toDate()} />}
                            {(gameState.game.status == 'ended') && <IonChip color='danger'>Afgelopen</IonChip>}
                        </IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Spel code</IonLabel>
                        <IonLabel slot='end' style={{fontVariantNumeric: 'tabular-nums'}}>{gameState.game.code}</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </>
    );
};
