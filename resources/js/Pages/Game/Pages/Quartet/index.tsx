import { router } from "@inertiajs/react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, RefresherEventDetail } from "@ionic/react";

import { GameStatePlaying } from "@/types/game";

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
                    {(Object.values(gameState.quartets).length > 0) ?
                        <IonItem>
                            <p>Hier zijn je team's kwartet setjes. Alle setjes met een vinkje erbij zijn compleet. Er zijn {gameState.game.quartet_categories} setjes te vinden met allemaal {gameState.game.quartet_values} kaartjes.</p>
                        </IonItem>
                    :
                        <IonItem>
                            <p>Hier komen de kwartet setjes van je team terecht. Vind en scan eerst wat QR codes en misschien dat je een kwartet kaartje vindt.</p>
                        </IonItem>
                    }

                    {Object.entries(gameState.quartets).map(([category, quartet]) => (
                        <IonItem key={category}>
                            <IonLabel>
                                {quartet.label} {(quartet.cards.length == gameState.game.quartet_values) && <FontAwesomeIcon icon={faCheck} style={{marginLeft: '0.25rem'}} />}
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
