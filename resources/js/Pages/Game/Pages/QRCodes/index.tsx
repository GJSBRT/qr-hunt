import { GameStatePlaying } from "@/types/game";
import { faRocket, faShapes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { router } from "@inertiajs/react";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonText, IonTitle, IonToolbar, RefresherEventDetail } from "@ionic/react";
import moment from "moment";

export default function QRCodes({ gameState }: { gameState: GameStatePlaying }) {
    const handleRefresh = function (event: CustomEvent<RefresherEventDetail>) {
        router.reload({
            onFinish: () => event.detail.complete(),
        });
    };

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>QR Codes</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <IonList lines="full">
                    <IonItem>
                        <p>Hier vind je jouw team's geclaimde QR codes.</p>
                    </IonItem>

                    {gameState.teamQrCodes.map((teamQrCode) => (
                        <IonItem detail={(teamQrCode.power != null || teamQrCode.quartet != null)} key={teamQrCode.id}>
                            {(teamQrCode.power || teamQrCode.quartet) &&
                                <IonText slot='start'>
                                    {teamQrCode.power && <FontAwesomeIcon icon={faRocket} />}
                                    {teamQrCode.quartet && <FontAwesomeIcon color={teamQrCode.quartet.color} icon={faShapes} />}
                                </IonText>
                            }

                            <IonLabel>
                                {teamQrCode.qr_code.description ??
                                    teamQrCode.quartet ? `${teamQrCode.quartet.category_label} - ${teamQrCode.quartet.value}`
                                    :
                                    teamQrCode.power ? `${teamQrCode.power.description}`
                                        :
                                        teamQrCode.qr_code.uuid
                                }
                                <p>{moment(teamQrCode.created_at).fromNow()}</p>
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </>
    );
};
