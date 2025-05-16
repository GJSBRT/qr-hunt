import { GameMap, GameMapAreaActionElementProps } from "@/Class/GameMode/map";
import { router } from "@inertiajs/react";
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonModal, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import axios from "axios";
import { useState } from "react";
import { TerritoryChallengeArea, TerritoryKothArea } from "./types/koth";
import { Form, Formik, FormikHelpers } from "formik";
import FormikRadio from "@/Components/IonicComponents/FormikRadio";
import FormikTextArea from "@/Components/IonicComponents/FormikTextArea";
import FormikImage from "@/Components/IonicComponents/FormikImage";
import { NewTerritoryMissionAnswer } from "./types/mission";
import { TerritoryGameStatePlaying } from "./types";

export class TerritoryMap extends GameMap {
    constructor() {
        super();

        this.areaActions = [
            {
                type: "in_zone",
                element: ({ area, gameState }: { area: TerritoryKothArea } & Omit<GameMapAreaActionElementProps, 'area'>) => {
                    if (area.gameType != 'koth') return <></>;

                    const [submitting, setSubmitting] = useState<boolean>(false);
                    const [presentLoading, dismissLoading] = useIonLoading();
                    const [present] = useIonToast();

                    const submit = function () {
                        if (submitting) return;
                        setSubmitting(true);

                        presentLoading({
                            message: 'Punt aan het claimen...'
                        });

                        axios.post(route('game.gamemode.action', 'claim_koth'), {
                            areaId: area.id
                        }, {})
                            .finally(() => {
                                dismissLoading();
                                setSubmitting(false);
                            })
                            .then(() => {
                                router.reload();

                                present({
                                    message: 'Je hebt dit punt geclaimed! Andere teams zijn op de hoogte gebracht ;)',
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

                    if (area.metadata.claimed_by_team && area.metadata.claimed_by_team.claim_team_id == gameState.teamData.team.id) {
                        return (
                            <IonButton disabled>
                                Jouw team heeft dit punt al geclaimed
                            </IonButton>
                        );
                    }

                    return (
                        <>
                            <IonButton onClick={submit}>
                                Claim king of the hill {/* TODO: zoek een nederlandse naam */}
                            </IonButton>
                        </>
                    );
                }
            },
            {
                type: "in_zone",
                element: (props) => {
                    const { area, gameState } = props as { area: TerritoryChallengeArea, gameState: TerritoryGameStatePlaying }; 

                    if (area.gameType != 'challenge') return <></>;

                    const [presentLoading, dismissLoading] = useIonLoading();
                    const [present] = useIonToast();
                    const [showModal, setShowModal] = useState(false);
                    const [submitting, setSubmitting] = useState(false);

                    const submit = function (formData: NewTerritoryMissionAnswer, {}: FormikHelpers<NewTerritoryMissionAnswer>) {
                        if (submitting) return;
                        setSubmitting(true);

                        presentLoading({
                            message: 'Antwoord aan het verzenden...'
                        });

                        axios.post(route('game.gamemode.action', 'claim_area'), {
                            areaId: area.id,
                            ...formData
                        }, {})
                            .finally(() => {
                                dismissLoading();
                                setSubmitting(false);
                            })
                            .then((response) => {
                                router.reload();
                                setShowModal(false);

                                if (response.data.correct === undefined) {
                                    present({
                                        message: 'Je hebt dit gebied geclaimed! Andere teams zijn op de hoogte gebracht ;)',
                                        duration: 10000,
                                        position: 'bottom',
                                        color: 'success',
                                    });
                                } else if (response.data.correct === null) {
                                    present({
                                        message: 'Je antwoord is ingedient en wordt zsm beoordeeld. Je wordt op de hoogte gehouden.',
                                        duration: 10000,
                                        position: 'bottom',
                                        color: 'primary',
                                    });
                                } else if (response.data.correct === true) {
                                    present({
                                        message: 'Je antwoord is correct! Dit gebied is nu van jouw team. Andere teams zijn op de hoogte gebracht ;)',
                                        duration: 10000,
                                        position: 'bottom',
                                        color: 'success',
                                    });
                                } else if (response.data.correct === false) {
                                    present({
                                        message: 'Je antwoord is helaas fout. Ga eerst veder naar een ander gebied en probeer het daarna hier weer opnieuw.',
                                        duration: 10000,
                                        position: 'bottom',
                                        color: 'danger',
                                    });
                                }
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

                    if (gameState.teamData.isTagged) {
                        return (
                            <IonButton disabled>
                                Je kan niet claimen als de tikker
                            </IonButton>
                        );
                    }

                    if (area.metadata.claimed_by_team && area.metadata.claimed_by_team.id == gameState.teamData.team.id) {
                        return (
                            <IonButton disabled>
                                Jouw team heeft dit punt al geclaimed
                            </IonButton>
                        );
                    }

                    const initialValues: NewTerritoryMissionAnswer = {
                        multiple_choice_id: null,
                        photo: null,
                        open_answer: null,
                    };

                    if (area.metadata.mission === null) {
                        return (
                            <IonButton onClick={() => submit(initialValues, {} as any)}>
                                Claim gebied
                            </IonButton>
                        );
                    }

                    const mission = area.metadata.mission;

                    return (
                        <>
                            <IonButton onClick={() => setShowModal(true)}>
                                Bekijk opdracht
                            </IonButton>

                            <IonModal isOpen={showModal}>
                                <IonHeader>
                                    <IonToolbar>
                                        <IonTitle>Opdracht</IonTitle>

                                        <IonButtons slot="end">
                                            <IonButton onClick={() => setShowModal(false)}>
                                                Sluiten
                                            </IonButton>
                                        </IonButtons>
                                    </IonToolbar>
                                </IonHeader>

                                <IonContent>
                                    <div className="ion-padding">
                                        <h1 style={{ marginTop: 0 }}>{mission.title}</h1>

                                        <p>{mission.description}</p>
                                    </div>

                                    <h2 style={{ marginLeft: '16px' }}>Antwoorden</h2>
                                    <Formik
                                        initialValues={initialValues}
                                        onSubmit={submit}
                                    >
                                        {(form) => (
                                            <>
                                                <Form onSubmit={form.handleSubmit}>
                                                    {(mission.answer_type == 'multiple_choice') && (
                                                        <>
                                                            <FormikRadio
                                                                form={form}
                                                                id="multiple_choice_id"
                                                                name="multiple_choice_id"
                                                                items={mission.multiple_choices.map((v) => ({
                                                                    value: v.id,
                                                                    label: v.answer
                                                                }))}
                                                            />
                                                        </>
                                                    )}

                                                    {(mission.answer_type == 'open_answer') && (
                                                        <IonItem>
                                                            <FormikTextArea
                                                                form={form}
                                                                name="open_answer"
                                                                type="text"
                                                                placeholder="Vul hier je antwoord in."
                                                                style={{minHeight: '32vh'}}
                                                            />
                                                        </IonItem>
                                                    )}

                                                    {(mission.answer_type == 'photo') && (
                                                        <FormikImage
                                                            form={form}
                                                            name="photo"
                                                        />
                                                    )}

                                                    <IonButton disabled={!form.dirty} className="ion-padding" expand='block' onClick={() => form.submitForm()}>
                                                        Versturen
                                                    </IonButton>
                                                </Form>
                                            </>
                                        )}
                                    </Formik>
                                </IonContent>
                            </IonModal>
                        </>
                    );
                }
            }
        ];
    }
}
