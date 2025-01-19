import { GameStatePlaying } from "@/types/game";
import { faRocket, faShapes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { router } from "@inertiajs/react";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonText, IonTitle, IonToolbar, RefresherEventDetail } from "@ionic/react";
import moment from "moment";
import QRCodeRow from "./Partials/QRCodeRow";

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

                    {gameState.teamQrCodes.map((teamQrCode) => <QRCodeRow key={teamQrCode.id} gameState={gameState} teamQrCode={teamQrCode}/>)}
                </IonList>
            </IonContent>
        </>
    );
};
