import * as Yup from 'yup';
import FormikField from "@/Components/IonicComponents/FormikField";
import FormikSelect from "@/Components/IonicComponents/FormikSelect";
import PullToRefresh from "@/Components/IonicComponents/PullToRefresh";
import { Game } from "@/types/game";
import { GameMasterProps } from "@/types/game_master";
import { router } from "@inertiajs/react";
import { IonButton, IonButtons, IonChip, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { Form, Formik, FormikHelpers } from "formik";
import Countdown from 'react-countdown';
import moment from 'moment';

const schema = Yup.object({
    name: Yup.string().min(1).max(255).required().label('Naam'),
});

export default function Overview({ game, gameMode }: GameMasterProps) {
    const [present] = useIonToast();
    const [presentLoading, dismissLoading] = useIonLoading();

    const submit = function (formData: Game, { setSubmitting }: FormikHelpers<Game>) {
        presentLoading({
            message: 'Spel aan het aanpassen...'
        });

        router.put(route('game-master.game.update', game.id), {
            ...formData
        }, {
            onFinish: () => {
                dismissLoading();
                setSubmitting(false);
            },
            onSuccess: () => {
                router.reload();
                present({
                    message: 'Spel aangepast!',
                    duration: 3000,
                    position: 'bottom',
                    color: 'success',
                });
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
    };

    return (
        <>
            <Formik
                initialValues={game as Game}
                onSubmit={submit}
                validationSchema={schema}
            >
                {(form) => (
                    <>
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>Overzicht</IonTitle>

                                <IonButtons slot="end">
                                    <IonButton onClick={() => form.submitForm()}>
                                        Opslaan
                                    </IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>

                        <IonContent>
                            <PullToRefresh />

                            <Form className="max-w-xl mx-auto" onSubmit={form.handleSubmit}>
                                <IonList lines='full'>
                                    <IonItem>
                                        <FormikField
                                            form={form}
                                            name="name"
                                            label="Spel naam"
                                            type="text"
                                        />
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel>Spel soort</IonLabel>
                                        <IonLabel slot='end'>{game.game_mode}</IonLabel>
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel>Speler aantal</IonLabel>
                                        <IonLabel slot='end'>{game.teams.reduce((a, b) => a + b.player_count, 0)}</IonLabel>
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel>Team aantal</IonLabel>
                                        <IonLabel slot='end'>{game.teams.length}</IonLabel>
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel>Tijd over</IonLabel>
                                        <IonLabel slot='end'>
                                            {(game.status == 'draft') && <IonChip>Spel is nog in schets</IonChip>}
                                            {(game.status == 'not_started') && <IonChip color='secondary'>Nog niet begonnen</IonChip>}
                                            {(game.status == 'started') && <Countdown daysInHours date={moment(game.started_at).add(game.play_duration, 'seconds').toDate()} />}
                                            {(game.status == 'ended') && <IonChip color='danger'>Afgelopen</IonChip>}
                                        </IonLabel>
                                    </IonItem>

                                    <IonItem>
                                        <FormikField
                                            form={form}
                                            name="code"
                                            label="Spel code"
                                            type="text"
                                        />
                                    </IonItem>

                                    <IonItem>
                                        <FormikField
                                            form={form}
                                            name="play_duration"
                                            label="Duratie in seconden"
                                            type="number"
                                        />
                                    </IonItem>

                                    <IonItem>
                                        <FormikSelect
                                            form={form}
                                            name="status"
                                            label="Status"
                                            items={[
                                                { label: 'Schets', value: 'draft' },
                                                { label: 'Niet gestart', value: 'not_started' },
                                                { label: 'Starten', value: 'starting' },
                                                { label: 'Gestart', value: 'started' },
                                                { label: 'Geeindigd', value: 'ended' },
                                            ]}
                                        />
                                    </IonItem>
                                </IonList>
                            </Form>

                            <div style={{ margin: '1rem', maxWidth: '75rem' }} dangerouslySetInnerHTML={{ __html: gameMode.gameDescriptionHtml }}></div>
                        </IonContent>
                    </>
                )}
            </Formik>
        </>
    );
};
