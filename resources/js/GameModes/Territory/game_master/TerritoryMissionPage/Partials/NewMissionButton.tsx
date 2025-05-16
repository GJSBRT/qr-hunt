import * as Yup from 'yup';
import FormikField from "@/Components/IonicComponents/FormikField";
import FormikTextArea from "@/Components/IonicComponents/FormikTextArea";
import { NewTerritoryMission } from "@/GameModes/Territory/types/mission";
import { Game } from "@/types/game";
import { router } from "@inertiajs/react";
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonList, IonModal, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import axios from 'axios';
import FormikSelect from '@/Components/IonicComponents/FormikSelect';

interface Props {
    game: Game;
}

const schema = Yup.object({
    title: Yup.string().min(1).max(255).required().label('Titel'),
    description: Yup.string().min(1).required().label('Beschrijving'),
});

const initialValues: NewTerritoryMission = {
    title: '',
    description: '',
    answer_type: 'open_answer',
};

export default function NewMissionButton({ game }: Props) {
    const [present] = useIonToast();
    const [presentLoading, dismissLoading] = useIonLoading();
    const [showModal, setShowModal] = useState<boolean>(false);

    const submit = function (formData: NewTerritoryMission, { setSubmitting }: FormikHelpers<NewTerritoryMission>) {
        presentLoading({
            message: 'Opdracht aan het aanmaken...'
        });

        axios.post(route('game-master.game.game-mode.action', {
            id: game.id,
            action: 'create_mission'
        }), {
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
                    message: 'Opdracht aangemaakt',
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
    };

    return (
        <>
            <IonButton onClick={() => setShowModal(true)}>
                Nieuw
            </IonButton>

            <IonModal isOpen={showModal}>
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
                                        <IonButton onClick={() => setShowModal(false)}>Annuleer</IonButton>
                                    </IonButtons>

                                    <IonTitle>Nieuwe opdracht</IonTitle>

                                    <IonButtons slot="end">
                                        <IonButton strong={true} onClick={() => form.submitForm()}>
                                            Aanmaken
                                        </IonButton>
                                    </IonButtons>
                                </IonToolbar>
                            </IonHeader>

                            <IonContent className="ion-padding">
                                <Form className="max-w-xl mx-auto" onSubmit={form.handleSubmit}>
                                    <IonList>
                                        <IonItem>
                                            <FormikField
                                                form={form}
                                                name="title"
                                                label="Titel"
                                                type="text"
                                                placeholder="Opdracht 10"
                                            />
                                        </IonItem>

                                        <IonItem>
                                            <FormikTextArea
                                                form={form}
                                                name="description"
                                                label="Beschrijving"
                                                type="text"
                                                style={{minHeight: '32vh'}}
                                                placeholder="Beschrijf de opdracht hier."
                                            />
                                        </IonItem>

                                        <IonItem>
                                            <FormikSelect
                                                form={form}
                                                name="answer_type"
                                                label="Antwoord soort"
                                                items={[
                                                    { label: 'Foto', value: 'photo' },
                                                    { label: 'Meerkeuze', value: 'multiple_choice' },
                                                    { label: 'Open antwoord', value: 'open_answer' },
                                                ]}
                                            />
                                        </IonItem>
                                    </IonList>
                                </Form>
                            </IonContent>
                        </>
                    )}
                </Formik>
            </IonModal>
        </>
    );
}
