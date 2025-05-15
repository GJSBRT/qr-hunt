import PullToRefresh from "@/Components/IonicComponents/PullToRefresh";
import { GameMasterProps } from "@/types/game_master";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from "@ionic/react";

export default function Overview({ game }: GameMasterProps) {
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Overzicht</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <PullToRefresh/>

                <IonList lines='full'>
                    <IonItem>
                        <IonLabel>Spel naam</IonLabel>
                        <IonLabel slot='end'>{game.name}</IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Spel soort</IonLabel>
                        <IonLabel slot='end'>{game.game_mode}</IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Speler aantal</IonLabel>
                        <IonLabel slot='end'>{game.teams.reduce((a,b) => a + b.player_count, 0)}</IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Team aantal</IonLabel>
                        <IonLabel slot='end'>{game.teams.length}</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </>
    );
};
