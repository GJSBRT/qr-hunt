import PullToRefresh from "@/Components/IonicComponents/PullToRefresh";
import { GameStatePlaying } from "@/types/game";
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import moment from "moment";

export default function Powers({ gameState }: { gameState: GameStatePlaying }) {
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Powers</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <PullToRefresh/>

                {(gameState.teamData.gamePowers?.length == 0) ? (
                    <IonList lines='full'>
                        <IonItem>
                            <IonLabel>Je team heeft nog geen powers.</IonLabel>
                        </IonItem>
                    </IonList>
                ) : (
                    <IonGrid fixed={true}>
                        <IonRow>
                            {gameState.teamData.gamePowers?.map((gamePower) => (
                                <IonCol size='12' sizeMd='3'>
                                    <IonCard
                                        color={(gamePower.used_on_team_id !== null) ? 'success' : 'danger'}
                                    >
                                        <IonCardHeader>
                                            <IonCardSubtitle>{moment(gamePower.claimed_at).fromNow()}</IonCardSubtitle>
                                        </IonCardHeader>

                                        <IonCardContent>{gamePower.description}</IonCardContent>
                                    </IonCard>
                                </IonCol>
                            ))}
                        </IonRow>
                    </IonGrid>
                )}
            </IonContent>
        </>
    );
};
