import { router } from "@inertiajs/react";
import { GameStatePlaying } from "@/types/game";
import { IonContent, IonHeader, IonItem, IonList, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, RefresherEventDetail } from "@ionic/react";

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
