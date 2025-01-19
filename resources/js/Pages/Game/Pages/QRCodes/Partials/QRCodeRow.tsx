import { GameStatePlaying } from "@/types/game";
import { Power } from "@/types/power";
import { QRCode, TeamQRCode } from "@/types/qr_code";
import { Quartet } from "@/types/quartet";
import { TeamPlayer } from "@/types/team";
import { faRocket, faShapes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { router } from "@inertiajs/react";
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonModal, IonRefresher, IonRefresherContent, IonText, IonTitle, IonToolbar, RefresherEventDetail } from "@ionic/react";
import moment from "moment";
import { useState } from "react";
import TransferQRCodeToTeam from "./TransferQRCodeToTeam";

interface Props {
    gameState: GameStatePlaying;
    teamQrCode: TeamQRCode & {
        qr_code: QRCode;
        power: Power;
        quartet: Quartet;
        team_player: TeamPlayer | null;
    }
};

export default function QRCodeRow({ gameState, teamQrCode }: Props) {
    const [showModal, setShowModal] = useState(false);

    const handleRefresh = function (event: CustomEvent<RefresherEventDetail>) {
        router.reload({
            onFinish: () => event.detail.complete(),
        });
    };

    return (
        <>
            <IonItem onClick={() => setShowModal(true)} detail={(teamQrCode.power != null || teamQrCode.quartet != null)} key={teamQrCode.id}>
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

            <IonModal isOpen={showModal}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>QR Code - {teamQrCode.qr_code.description ??
                            teamQrCode.quartet ? `${teamQrCode.quartet.category_label} - ${teamQrCode.quartet.value}`
                            :
                            teamQrCode.power ? `${teamQrCode.power.description}`
                                :
                                teamQrCode.qr_code.uuid
                        }</IonTitle>

                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowModal(false)}>
                                Sluiten
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>

                    <IonList lines="full">
                        <IonItem>
                            <IonText>Gescanned door</IonText>
                            <IonText slot='end'>{teamQrCode.team_player?.name ?? 'Onbekend'}</IonText>
                        </IonItem>

                        <IonItem>
                            <IonText>Gescanned op</IonText>
                            <IonText slot='end'>{moment(teamQrCode.created_at).fromNow()}</IonText>
                        </IonItem>

                        {teamQrCode.transferred_from_team &&
                            <IonItem>
                                <IonText>Overgenomen van team</IonText>
                                <IonText slot='end'>{teamQrCode.transferred_from_team.name}</IonText>
                            </IonItem>
                        }

                        {teamQrCode.quartet &&
                            <IonItem>
                                <IonText>Kwartet stuk</IonText>
                                <IonText slot='end'>{teamQrCode.quartet.category_label} - {teamQrCode.quartet.value}</IonText>
                            </IonItem>
                        }

                        <TransferQRCodeToTeam gameState={gameState} teamQrCode={teamQrCode} />
                    </IonList>
                </IonContent>
            </IonModal>
        </>
    );
};
