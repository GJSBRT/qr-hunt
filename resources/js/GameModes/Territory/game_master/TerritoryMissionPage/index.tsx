import { TerritoryGameMasterProps } from "..";
import PullToRefresh from "@/Components/IonicComponents/PullToRefresh";
import { IonActionSheet, IonButton, IonButtons, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonList, IonModal, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { TerritoryMission, TerritoryMissionAnswer, TerritoryMissionMultipleChoiceAnswer } from "../../types/mission";
import { useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import { IonActionSheetCustomEvent } from "@/types";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import NewMissionButton from "./Partials/NewMissionButton";

export default function TerritoryMissionPage({ game, missions }: TerritoryGameMasterProps) {
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [showMissionActions, setShowMissionActions] = useState<boolean>(false);
    const [viewingMission, setViewingMission] = useState<TerritoryMission & {
        multiple_choices: TerritoryMissionMultipleChoiceAnswer[];
    } | null>(null);
    const [presentLoading, dismissLoading] = useIonLoading();
    const [present] = useIonToast();

    const submit = function (missionAnswerId: number, correct: boolean) {
        if (submitting) return;
        setSubmitting(true);

        presentLoading({
            message: 'Beoordeling aan het verzenden...'
        });

        axios.post(route('game-master.game.game-mode.action', {
            id: game.id,
            action: 'review_mission_answer'
        }), {
            mission_answer_id: missionAnswerId,
            correct: correct,
        }, {})
            .finally(() => {
                dismissLoading();
                setSubmitting(false);
            })
            .then(() => {
                router.reload();

                present({
                    message: 'De beoordeling is verzonden/',
                    duration: 5000,
                    position: 'bottom',
                    color: 'success',
                });
            })
            .catch((err) => {
                console.error(err);
                if (typeof err == 'string') {
                    present({
                        message: err,
                        duration: 5000,
                        position: 'bottom',
                        color: 'danger',
                    });
                } else if ('response' in (err as any) && (err as any).response.data?.message) {
                    present({
                        message: (err as any).response.data?.message,
                        duration: 5000,
                        position: 'bottom',
                        color: 'danger',
                    });
                } else {
                    present({
                        message: 'Er is een onbekende fout opgetreden. Probeer het nogmaals.',
                        duration: 5000,
                        position: 'bottom',
                        color: 'danger',
                    });
                }
            })
    }

    function missionActionDismiss(e: IonActionSheetCustomEvent<OverlayEventDetail>) {
        if (!viewingMission) {
            setViewingMission(null);
            setShowMissionActions(false);
            return;
        }

        if (e.detail.role == 'backdrop') {
            setShowMissionActions(false);
            return;
        }

        presentLoading({
            message: 'Opdracht aan het verwijderen...'
        });

        switch (e.detail.data['action']) {
            case 'delete':
                axios.post(route('game-master.game.game-mode.action', {
                    id: game.id,
                    action: 'delete_mission'
                }), {
                    mission_id: viewingMission.id
                }, {})
                    .finally(() => {
                        setShowMissionActions(false);
                        dismissLoading();
                    })
                    .then(() => {
                        setViewingMission(null);
                        router.reload();

                        present({
                            message: 'Opdracht verwijdered',
                            duration: 3000,
                            position: 'bottom',
                            color: 'success',
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        if (typeof err == 'string') {
                            present({
                                message: err,
                                duration: 5000,
                                position: 'bottom',
                                color: 'danger',
                            });
                        } else if ('response' in (err as any) && (err as any).response.data?.message) {
                            present({
                                message: (err as any).response.data?.message,
                                duration: 5000,
                                position: 'bottom',
                                color: 'danger',
                            });
                        } else {
                            present({
                                message: 'Er is een onbekende fout opgetreden. Probeer het nogmaals.',
                                duration: 5000,
                                position: 'bottom',
                                color: 'danger',
                            });
                        }
                    })
                return;
        }
    }

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Opdrachten</IonTitle>

                    <IonButtons slot="end">
                        <NewMissionButton game={game}/>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <PullToRefresh />

                <IonList lines='full'>
                    {(missions.length == 0) && (
                        <IonItem>
                            Er zijn nog geen opdrachten
                        </IonItem>
                    )}

                    {missions.map((mission) => (
                        <IonItem key={mission.id} onClick={() => setViewingMission(mission)} detail>
                            <IonLabel>({mission.id}) {mission.title}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>

            <IonModal isOpen={viewingMission !== null}>
                {(viewingMission) && (
                    <>
                        <IonHeader>
                            <IonToolbar>
                                <IonButtons slot="start">
                                    <IonButton strong onClick={() => setShowMissionActions(true)}>
                                        Acties
                                    </IonButton>
                                </IonButtons>

                                <IonTitle>{viewingMission.title}</IonTitle>

                                <IonButtons slot="end">
                                    <IonButton onClick={() => setViewingMission(null)}>
                                        Sluiten
                                    </IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>

                        <IonContent>
                            <PullToRefresh />

                            {/* <IonList lines="full">
                                {(viewingTeam.team_players.length == 0) && (
                                    <IonItem>
                                        Geen spelers in dit team.
                                    </IonItem>
                                )}

                                {viewingTeam.team_players.map((player) => (
                                    <IonItem key={player.id} onClick={() => setViewingTeamPlayer(player)} detail>
                                        <IonLabel>{player.name}</IonLabel>
                                    </IonItem>
                                ))}
                            </IonList> */}
                        </IonContent>
                    </>
                )}
            </IonModal>

            <IonActionSheet
                isOpen={showMissionActions}
                header="Acties"
                buttons={[
                    {
                        text: 'Verwijder opdracht',
                        role: 'destructive',
                        data: {
                            action: 'delete',
                        },
                    },
                ]}
                onDidDismiss={missionActionDismiss}
            />
        </>
    )
}