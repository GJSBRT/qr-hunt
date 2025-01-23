import moment from "moment";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonModal, IonNote, IonRefresher, IonRefresherContent, IonText, IonTitle, IonToolbar, RefresherEventDetail, useIonLoading, useIonToast } from "@ionic/react";

import { Team } from "@/types/team";
import { TeamQRCode } from "@/types/qr_code";
import { GameStatePlaying } from "@/types/game";
import { Power, POWER_TYPE_LANGUAGE } from "@/types/power";

interface Props {
    gameState: GameStatePlaying;
    teamQrCode: TeamQRCode & {
        power_applied_to_team: Team | null;
    };
    power: Power;
};

export default function UsePowerUp({ gameState, teamQrCode, power }: Props) {
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

        router.put(route('game.qr-code.power', teamQrCode.id), {
            team_id: selectedTeam ? selectedTeam.id : null,
        }, {
            onFinish: () => {
                dismissLoading();
            },
            onSuccess: () => {
                router.visit(route('game.index') + "?page=qrcodes");
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
            {teamQrCode.power_used_at ? 
                <IonItem>
                    <IonLabel>
                        Power gebruikt op team

                        <p>{moment(teamQrCode.power_used_at).fromNow()}</p>
                    </IonLabel>

                    <IonText>{teamQrCode.power_applied_to_team?.name}</IonText>
                </IonItem>
            :
                <IonItem detail onClick={() => setShowModal(true)}>
                    <IonLabel>
                        <b>Power gebruiken</b>
                    </IonLabel>
                </IonItem>
            }

            <IonModal isOpen={showModal}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={() => setShowModal(false)}>
                                Sluiten
                            </IonButton>
                        </IonButtons>

                        <IonTitle>
                            '{power.description ?? POWER_TYPE_LANGUAGE[power.type] ?? 'Onbekende'}' power
                        </IonTitle>

                        <IonButtons slot="end">
                            <IonButton strong onClick={submit}>
                                Activeer
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
                                <p>
                                    {(power.related_to_other_team) ? (
                                        power.power_up ?
                                            'Dit is een power up voor een ander team. Selecteer het team hieronder.'
                                            :
                                            'Dit is een power down voor een ander team. Selecteer het gelukkige team hieronder.'
                                    ) : (
                                        power.power_up ?
                                            'Jouw team heeft een power up verdiendt! Gefeliciflapstaart.'
                                            :
                                            'Helaas heeft jouw team een power down gekregen. Helaas.'
                                    )}
                                </p>
                            </IonText>
                        </IonItem>

                        {(power.related_to_other_team) && (
                            <IonItemGroup>
                                <IonItemDivider>
                                    <IonLabel>Selecteer een team</IonLabel>
                                </IonItemDivider>

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
                            </IonItemGroup>
                        )}
                    </IonList>
                </IonContent>
            </IonModal>
        </>
    );
};
