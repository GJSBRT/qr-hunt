import { GameStatePlaying } from "@/types/game";
import { Power, POWER_TYPE_LANGUAGE } from "@/types/power";
import { QRCode, TeamQRCode } from "@/types/qr_code";
import { Quartet } from "@/types/quartet";
import { Team, TeamPlayer } from "@/types/team";
import { router } from "@inertiajs/react";
import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonItem, IonLabel, IonList, IonModal, IonRefresher, IonRefresherContent, IonText, IonTitle, IonToolbar, RefresherEventDetail, useIonLoading, useIonToast } from "@ionic/react";
import { useState } from "react";

interface Props {
    gameState: GameStatePlaying;
    teamQrCode: TeamQRCode & {
        qr_code: QRCode;
        power: Power|null;
        quartet: Quartet|null;
        team_player: TeamPlayer | null;
    }
};

interface bodyType {
    team_id: number;
}

export default function TransferQRCodeToTeam({ gameState, teamQrCode }: Props) {
    const [presentToast] = useIonToast();
    const [presentLoading, dismissLoading] = useIonLoading();
    const [showModal, setShowModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    const handleRefresh = function (event: CustomEvent<RefresherEventDetail>) {
        router.reload({
            onFinish: () => event.detail.complete(),
        });
    };

    const submit = function () {
        if (!selectedTeam) {
            presentToast({
                message: "Selecteer eerst een team.",
                duration: 5000,
                position: 'bottom',
                color: 'danger',
            });
            return;
        }

        presentLoading({
            message: 'QR code aan het overdragen...'
        });

        router.put(route('game.qr-code.transfer', teamQrCode.id), {
            team_id: selectedTeam.id,
        }, {
            onFinish: () => {
                dismissLoading();
            },
            onSuccess: () => {
                router.visit(route('game.index')+"?page=qrcodes");
            },
            onError: (error) => {
                let errors = '';

                Object.values(error).forEach((error, index) => {
                    errors += error;

                    if (Object.values(error).length - 1 != index) {
                        errors + '\n\n';
                    }
                });

                presentToast({
                    message: errors,
                    duration: 5000,
                    position: 'bottom',
                    color: 'danger',
                });
            },
        });
    };

    return (
        <>
            <IonItem detail onClick={() => setShowModal(true)}>
                <IonLabel>
                    Overdragen aan ander team
                </IonLabel>
            </IonItem>

            <IonModal isOpen={showModal}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={() => setShowModal(false)}>
                                Sluiten
                            </IonButton>
                        </IonButtons>

                        <IonButtons slot="end">
                            <IonButton strong onClick={submit}>
                                Overdragen
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
                            <IonText>
                                <p>Hier kan je de QR code '{teamQrCode.qr_code.description ?? (
                                    teamQrCode.quartet ? `${teamQrCode.quartet.category_label} - ${teamQrCode.quartet.value}`
                                    :
                                    teamQrCode.power ? `${teamQrCode.power.description ?? POWER_TYPE_LANGUAGE[teamQrCode.power.type] ?? 'Onbekende power'}`
                                        :
                                        teamQrCode.qr_code.uuid
                                )}' overdragen aan een ander team. Selecteer hieronder het team. P.S. van ruilen komt huilen ;)</p>
                            </IonText>
                        </IonItem>

                        {gameState.teams.map(team => (
                            (team.id != gameState.team.id) &&
                            <IonItem key={team.id}>
                                <IonCheckbox
                                    checked={team.id == selectedTeam?.id}
                                    slot="start"
                                    aria-label="Selecteer team"
                                    onIonChange={(e) => {
                                        if (e.detail.checked) {
                                            setSelectedTeam(team);
                                        } else {
                                            setSelectedTeam(null);
                                        }
                                    }}
                                />
                                <IonText>{team.name}</IonText>
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </IonModal>
        </>
    );
};
