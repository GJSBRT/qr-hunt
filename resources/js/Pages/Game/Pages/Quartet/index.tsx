import { GameStatePlaying } from "@/types/game";
import { router } from "@inertiajs/react";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonRow, IonText, IonTitle, IonToolbar, RefresherEventDetail } from "@ionic/react";

export default function Quartet({ gameState }: { gameState: GameStatePlaying }) {
    const handleRefresh = function (event: CustomEvent<RefresherEventDetail>) {
        router.reload({
            onFinish: () => event.detail.complete(),
        });
    };

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Kwartet</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <IonList lines="full">
                    <IonItem>
                        <p>Hier zijn je team's kwartet setjes.</p>
                    </IonItem>

                    {Object.entries(gameState.quartets).map(([category, quartet]) => (
                        <IonItem key={category}>
                            <IonLabel>
                                {quartet.label}
                            </IonLabel>

                            <IonLabel>
                                <div
                                    style={{
                                        display: 'grid',
                                        gap: '0.25rem',
                                        gridTemplateColumns: `repeat(${gameState.game.quartet_values}, minmax(0, 1fr))`,
                                    }}
                                >
                                    {quartet.cards.map(card => (
                                        <div key={`${category}-${card}`} style={{
                                            gridColumnStart: card,
                                            fontVariantNumeric: 'tabular-nums',
                                            backgroundColor: quartet.color,
                                            padding: '0.25rem',
                                            textAlign: 'center',
                                            width: '100%',
                                            marginTop: '-0.25rem',
                                            marginBottom: '-0.25rem',
                                            borderRadius: '3px',
                                            textShadow: '-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white'
                                        }}>
                                            {card}
                                        </div>
                                    ))}
                                </div>
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </>
    );
};
