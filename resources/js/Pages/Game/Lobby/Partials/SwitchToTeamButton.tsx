import * as Yup from 'yup';
import FormikField from "@/Components/IonicComponents/FormikField";
import { GameState } from "@/types/game";
import { router } from "@inertiajs/react";
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonModal, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useRef, useState } from "react";
import { Team } from '@/types/team';

const schema = Yup.object({
    player_name: Yup.string().min(1).max(255).required().label('Speler naam'),
});

interface body {
    team_id:        number|null;
    player_name?:   string;
}

export default function SwitchToTeamButton({ gameState, team }: { gameState: GameState, team: Team }) {
    const [present] = useIonToast();
    const [presentLoading, dismissLoading] = useIonLoading();
    const modal = useRef<HTMLIonModalElement>(null);
    const [showModal, setShowModal] = useState(false);

    const initialValues: body = {
        team_id: team.id,
    }

    const submit = function (data: body, setSubmitting?: (b: boolean) => void) {
        presentLoading({
            message: 'Aan het team aansluiten...'
        });

        router.put(route('game.lobby.teams.switch', {
            gameId: gameState.game.id,
        }), {
            ...data
        }, {
            onFinish: () => {
                dismissLoading();
                if (setSubmitting) setSubmitting(false);
            },
            onSuccess: () => {
                router.reload();
                setShowModal(false);
            },
            onError: (error) => {
                let errors = '';

                Object.values(error).forEach((error, index) => {
                    errors += error;

                    if (Object.values(error).length - 1 != index) {
                        errors + '\n\n';
                    }
                });

                present({
                    message: errors,
                    duration: 5000,
                    position: 'bottom',
                    color: 'danger',
                });
            },
        });
    }

    const formSubmit = function (formData: body, { setSubmitting }: FormikHelpers<body>) {
        submit(formData, setSubmitting);
    }

    const changeTeam = function() {
        if (!gameState.teamPlayer) {
            setShowModal(true);
            return
        }

        submit({
            team_id: team.id,
        });
    }

    return (
        <>
            <IonButton onClick={changeTeam} fill="clear" slot='end'>
                {gameState.teamPlayer ? 'Verander van team' : 'Meedoen aan team'}
            </IonButton>

            <IonModal isOpen={showModal}>
                <Formik
                    initialValues={initialValues}
                    onSubmit={formSubmit}
                    validationSchema={schema}
                >
                    {(form) => (
                        <>
                            <IonHeader>
                                <IonToolbar>
                                    <IonButtons slot="start">
                                        <IonButton onClick={() => modal.current?.dismiss()}>Annuleer</IonButton>
                                    </IonButtons>

                                    <IonTitle>Mee doen aan '{team.name}'</IonTitle>

                                    <IonButtons slot="end">
                                        <IonButton strong={true} onClick={() => form.submitForm()}>
                                            Meedoen
                                        </IonButton>
                                    </IonButtons>
                                </IonToolbar>
                            </IonHeader>

                            <IonContent className="ion-padding">
                                <IonItem>
                                    <Form className="max-w-xl mx-auto" onSubmit={form.handleSubmit}>
                                        <FormikField
                                            form={form}
                                            name="player_name"
                                            label="Jouw naam"
                                            type="text"
                                            placeholder="Wat is jouw naam?"
                                        />
                                    </Form>
                                </IonItem>
                            </IonContent>
                        </>
                    )}
                </Formik>
            </IonModal>
        </>
    );
}