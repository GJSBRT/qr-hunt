import * as Yup from 'yup';
import FormikField from "@/Components/IonicComponents/FormikField";
import { GameState } from "@/types/game";
import { router } from "@inertiajs/react";
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonModal, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useRef } from "react";

const schema = Yup.object({
    team_name: Yup.string().min(1).max(255).required().label('Team naam'),
    player_name: Yup.string().min(1).max(255).nullable().label('Speler naam'),
});

interface newTeamBody {
    team_name: string;
    player_name?: string;
}

export default function CreateTeamButton({ gameState }: { gameState: GameState }) {
    const [present] = useIonToast();
    const [presentLoading, dismissLoading] = useIonLoading();
    const modal = useRef<HTMLIonModalElement>(null);

    const initialValues: newTeamBody = {
        team_name: '',
    }

    const submit = function (formData: newTeamBody, { setSubmitting }: FormikHelpers<newTeamBody>) {
        presentLoading({
            message: 'Team aan het aanmaken...'
        });

        router.post(route('game.lobby.teams.create', {
            gameId: gameState.game.id,
        }), {
            ...formData
        }, {
            onFinish: () => {
                dismissLoading();
                setSubmitting(false);
            },
            onSuccess: () => {
                router.reload();
                modal.current?.dismiss();
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

    return (
        <>
            <IonButton id="open-modal" expand="block">
                Nieuw team
            </IonButton>

            <IonModal ref={modal} trigger="open-modal">

                <Formik
                    initialValues={initialValues}
                    onSubmit={submit}
                    validationSchema={schema}
                >
                    {(form) => (
                        <>
                            <IonHeader>
                                <IonToolbar>
                                    <IonButtons slot="start">
                                        <IonButton onClick={() => modal.current?.dismiss()}>Annuleer</IonButton>
                                    </IonButtons>

                                    <IonTitle>Nieuw team</IonTitle>

                                    <IonButtons slot="end">
                                        <IonButton strong={true} onClick={() => form.submitForm()}>
                                            Aanmaken
                                        </IonButton>
                                    </IonButtons>
                                </IonToolbar>
                            </IonHeader>

                            <IonContent className="ion-padding">
                                <IonItem>
                                    <Form className="max-w-xl mx-auto" onSubmit={form.handleSubmit}>
                                        <FormikField
                                            form={form}
                                            name="team_name"
                                            label="Team naam"
                                            type="text"
                                            placeholder="Een coole team naam"
                                        />

                                        {(!gameState.teamPlayer) &&
                                            <FormikField
                                                form={form}
                                                name="player_name"
                                                label="Jouw naam"
                                                type="text"
                                                placeholder="Wat is jouw naam?"
                                            />
                                        }
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