import { GameMaster } from "@/Class/GameMode/game_master";
import PullToRefresh from "@/Components/IonicComponents/PullToRefresh";
import { GameMasterProps } from "@/types/game_master";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonList, IonModal, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { TerritoryMission, TerritoryMissionAnswer, TerritoryMissionMultipleChoiceAnswer } from "../types/mission";
import { Team } from "@/types/team";
import { faFilePen, faList } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import TerritoryMissionPage from "./TerritoryMissionPage";

export interface TerritoryGameMasterProps extends GameMasterProps {
    missionAnswersToReview: Array<TerritoryMissionAnswer & {
        territory_mission: TerritoryMission;
        team: Team;
    }>;
    missions: Array<TerritoryMission & {
        multiple_choices: TerritoryMissionMultipleChoiceAnswer[];
    }>;
}

export class TerritoryGameMaster extends GameMaster {
    constructor() {
        super();

        this.pages = [
            {
                name: 'review',
                label: 'Nakijken',
                icon: faFilePen,
                element: (props) => {
                    const { missionAnswersToReview } = props as TerritoryGameMasterProps;

                    const [submitting, setSubmitting] = useState<boolean>(false);
                    const [presentLoading, dismissLoading] = useIonLoading();
                    const [present] = useIonToast();

                    const submit = function (missionAnswerId: number, correct: boolean) {
                        if (submitting) return;
                        setSubmitting(true);

                        presentLoading({
                            message: 'Beoordeling aan het verzenden...'
                        });

                        axios.post(route('game-master.game.game-mode.action', {
                            id: props.game.id,
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

                    useEffect(() => {
                        let intervalId = setInterval(() => {
                            router.reload();
                        }, 5000);

                        return function() {
                            clearInterval(intervalId);
                        };
                    }, []);

                    return (
                        <>
                            <IonHeader>
                                <IonToolbar>
                                    <IonTitle>Antwoorden nakijken</IonTitle>
                                </IonToolbar>
                            </IonHeader>

                            <IonContent>
                                <PullToRefresh />

                                <IonList lines='full'>
                                    {(missionAnswersToReview.length == 0) && (
                                        <IonItem>
                                            Er hoeft niks nagekeken te worden.
                                        </IonItem>
                                    )}

                                    {missionAnswersToReview.map((missionAnswer) => (
                                        <IonItem key={missionAnswer.id}>
                                            <IonCard style={{ width: '100%' }}>
                                                <IonCardHeader>
                                                    <IonCardTitle>{missionAnswer.territory_mission.title}</IonCardTitle>
                                                    <IonCardSubtitle>Team {missionAnswer.team.name}</IonCardSubtitle>
                                                </IonCardHeader>

                                                <IonCardContent>
                                                    {(missionAnswer.open_answer !== null) && (
                                                        missionAnswer.open_answer
                                                    )}

                                                    {(missionAnswer.photo !== null) && (
                                                        <IonImg src={'data:image;base64,'+missionAnswer.photo} alt='Submitted photo' />
                                                    )}
                                                </IonCardContent>

                                                <IonButton fill="clear" onClick={() => submit(missionAnswer.id, true)}>Goedkeuren</IonButton>
                                                <IonButton fill="clear" onClick={() => submit(missionAnswer.id, false)}>Foutkeuren</IonButton>
                                            </IonCard>
                                        </IonItem>
                                    ))}
                                </IonList>
                            </IonContent>
                        </>
                    )
                }
            },
            {
                name: 'mission',
                label: 'Opdrachten',
                icon: faList,
                element: (props) => <TerritoryMissionPage {...props as TerritoryGameMasterProps}/>
            },
        ];
    }
}
