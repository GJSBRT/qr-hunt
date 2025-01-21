import { GameStatePlaying } from "@/types/game";
import { POWER_TYPE_LANGUAGE } from "@/types/power";
import { router } from "@inertiajs/react";
import { IonChip, IonContent, IonHeader, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonText, IonTitle, IonToolbar, RefresherEventDetail } from "@ionic/react";
import moment from "moment";
import Countdown from "react-countdown";
import PowerAppliedQRCode from "./Partials/PowerAppliedQRCode";

export default function Overview({ gameState }: { gameState: GameStatePlaying }) {
    const handleRefresh = function (event: CustomEvent<RefresherEventDetail>) {
        router.reload({
            onFinish: () => event.detail.complete(),
        });
    };

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Overzicht</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>

                <IonList lines='full'>
                    <IonItem>
                        <IonLabel>Jouw naam</IonLabel>
                        <IonLabel slot='end'>{gameState.teamPlayer.name}</IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Team</IonLabel>
                        <IonLabel slot='end'>{gameState.team.name}</IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Tijd over</IonLabel>
                        <IonLabel slot='end'>
                            {(gameState.game.status == 'draft') && <IonChip>Spel is nog in schets</IonChip>}
                            {(gameState.game.status == 'not_started') && <IonChip color='secondary'>Nog niet begonnen</IonChip>}
                            {(gameState.game.status == 'started') && <Countdown daysInHours date={moment(gameState.game.started_at).add(gameState.game.play_duration, 'seconds').toDate()} />}
                            {(gameState.game.status == 'ended') && <IonChip color='danger'>Afgelopen</IonChip>}
                        </IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Spel code</IonLabel>
                        <IonLabel slot='end' style={{ fontVariantNumeric: 'tabular-nums' }}>{gameState.game.code}</IonLabel>
                    </IonItem>

                    <IonItem>
                        <IonText>
                            <p>Hieronder staan je team's huidige toegepaste powers, scan freezes, etc.</p>
                        </IonText>
                    </IonItem>

                    {gameState.scanFreeze.map((scanFreeze) => (
                        <IonItem key={'scanFreeze' + scanFreeze.id}>
                            <IonText>Scan freeze</IonText>
                            <IonText slot='end'><Countdown onComplete={() => router.reload()} daysInHours date={moment(scanFreeze.ends_at).toDate()} /></IonText>
                        </IonItem>
                    ))}

                    {gameState.powerAppliedTeamQRCodes.map((teamQRcode) => (
                        <PowerAppliedQRCode game={gameState.game} teamQRcode={teamQRcode} key={'teamQRcode' + teamQRcode.id} />
                    ))}
                </IonList>
            </IonContent>
        </>
    );
};
