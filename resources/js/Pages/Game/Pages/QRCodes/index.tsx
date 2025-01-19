import { GameStatePlaying } from "@/types/game";
import { faRocket, faShapes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { router } from "@inertiajs/react";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonText, IonTitle, IonToolbar, RefresherEventDetail, useIonToast } from "@ionic/react";
import moment from "moment";
import QRCodeRow from "./Partials/QRCodeRow";
import { useContext, useEffect } from "react";
import { SocketContext } from "@/Layouts/GameLayout";
import { TeamQRCodeTransferredEvent } from "@/types/events";

export default function QRCodes({ gameState }: { gameState: GameStatePlaying }) {
    const [presentToast] = useIonToast();

    const handleRefresh = function (event: CustomEvent<RefresherEventDetail>) {
        router.reload({
            onFinish: () => event.detail.complete(),
        });
    };

    const echo = useContext(SocketContext);

    useEffect(() => {
        if (!echo) return;

        echo.private(`team.${gameState.team.id}`).listen('TeamQRCodeTransferredEvent', (e: TeamQRCodeTransferredEvent) => {
            presentToast({
                message: (e.from_team_id == gameState.team.id) ? 'Jouw team heeft een QR code weggegeven.' : 'Je team heeft een QR code ontvangen!',
                duration: 5000,
                position: 'bottom',
                color: (e.from_team_id == gameState.team.id) ? 'warning' : 'success',
            });

            router.reload();
        });

        return () => {
            echo.leave(`team.${gameState.team.id}`);
        };
    })

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
