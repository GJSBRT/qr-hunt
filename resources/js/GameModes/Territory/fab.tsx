import { GameFab } from "@/Class/GameMode/fab";
import { IonButton, IonButtons, IonContent, IonFabButton, IonHeader, IonModal, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import FormikRadio from "@/Components/IonicComponents/FormikRadio";
import { Form, Formik, FormikHelpers } from "formik";
import axios from "axios";
import { router } from "@inertiajs/react";
import { TerritoryGameStatePlaying } from "./types";
import PullToRefresh from "@/Components/IonicComponents/PullToRefresh";

export class TerritoryFab extends GameFab {
    constructor() {
        super();

        this.actions = [
            {
                element: (props) => {
                    const { gameState } = props as { gameState: TerritoryGameStatePlaying };

                    const [presentLoading, dismissLoading] = useIonLoading();
                    const [present] = useIonToast();
                    const [showModal, setShowModal] = useState(false);

                    const submit = function (formData: {team_id: number}, { setSubmitting }: FormikHelpers<{team_id: number}>) {
                        presentLoading({
                            message: 'Team aan het tikken...'
                        });

                        axios.post(route('game.gamemode.action', 'tag_team'), {
                            ...formData
                        }, {})
                            .finally(() => {
                                dismissLoading();
                                setSubmitting(false);
                            })
                            .then(() => {
                                router.reload();
                                setShowModal(false);

                                present({
                                    message: 'Je bent nu geen tikker meer. Je kan nu weer punten claimen.',
                                    duration: 10000,
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

                    return (
                        <>
                            <IonFabButton disabled={!gameState.teamData.isTagged} onClick={() => setShowModal(true)}>
                                <FontAwesomeIcon size='lg' icon={faPersonRunning} />
                            </IonFabButton>

                            <IonModal isOpen={showModal}>
                                <IonHeader>
                                    <IonToolbar>
                                        <IonTitle>Tik doorgeven</IonTitle>

                                        <IonButtons slot="end">
                                            <IonButton onClick={() => setShowModal(false)}>
                                                Sluiten
                                            </IonButton>
                                        </IonButtons>
                                    </IonToolbar>
                                </IonHeader>

                                <IonContent>
                                    <PullToRefresh />

                                    <p className="ion-padding">Selecteer welk team je getikt hebt om het stokje door te geven.</p>

                                    <Formik
                                        initialValues={{
                                            team_id: null,
                                        } as any}
                                        onSubmit={submit}
                                    >
                                        {(form) => (
                                            <Form onSubmit={form.handleSubmit}>
                                                <FormikRadio
                                                    form={form}
                                                    id="team_id"
                                                    name="team_id"
                                                    items={gameState.teams.filter((t) => t.id !== gameState.teamPlayer.team_id).map((team) => ({
                                                        value: team.id,
                                                        label: team.name
                                                    }))}
                                                />

                                                <IonButton disabled={!form.dirty} className="ion-padding" expand='block' onClick={() => form.submitForm()}>
                                                    Overdragen
                                                </IonButton>
                                            </Form>
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
