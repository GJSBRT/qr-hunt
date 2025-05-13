import PullToRefresh from "@/Components/IonicComponents/PullToRefresh";
import { Game } from "@/types/game";
import { IonChip, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from "@ionic/react";

export default function Overview({ game }: { game: Game }) {
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
                </IonList>
            </IonContent>
        </>
    );
};
