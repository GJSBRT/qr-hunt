import PullToRefresh from "@/Components/IonicComponents/PullToRefresh";
import { GameMasterProps } from "@/types/game_master";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from "@ionic/react";

export default function Score({ results }: GameMasterProps) {
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Score</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <PullToRefresh />

                <IonList lines='full'>
                    {(results.length == 0) && (
                        <IonItem>
                            Er zijn nog geen teams in dit spel
                        </IonItem>
                    )}

                    {results.map((teamScore) => (
                        <IonItem>
                            <IonLabel>{teamScore.team.name}</IonLabel>
                            <IonLabel slot='end'>{teamScore.score} pnt</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </>
    );
};
