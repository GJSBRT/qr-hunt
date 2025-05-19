import { router } from "@inertiajs/react";
import { Formik } from "formik";
import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonRow, IonSegment, IonSegmentButton, IonSegmentContent, IonSegmentView, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import FormikField from '@/Components/IonicComponents/FormikField';
import IonicAppLayout from '@/Layouts/IonicAppLayout';

export default function Welcome({inGame}: {inGame: boolean}) {
    const [presentAlert] = useIonAlert();

    return (
        <IonicAppLayout title='Welkom'>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Welkom!</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonSegment value="join" >
                    <IonSegmentButton value="join" contentId='join'>
                        <IonLabel>Meedoen</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="create" contentId='create'>
                        <IonLabel>Spel creeren</IonLabel>
                    </IonSegmentButton>
                </IonSegment>

                <IonSegmentView>
                    <IonSegmentContent id='join'>
                        <IonGrid style={{height: '100%'}}>
                            <IonRow className='ion-justify-content-center ion-align-items-center' style={{height: '100%'}}>
                                <IonCol size='12'>
                                    <Formik
                                        initialValues={{ code: '' }}
                                        onSubmit={(values) => {
                                            router.post(route('game.lobby.join'), {
                                                code: values.code
                                            }, {
                                                onError: (error) => {
                                                    let errors = '';

                                                    Object.values(error).forEach((error, index) => {
                                                        errors += error;

                                                        if (Object.values(error).length - 1 != index) {
                                                            errors + '\n\n';
                                                        }
                                                    });

                                                    presentAlert({
                                                        header: 'Oops.',
                                                        message: errors,
                                                        buttons: ['Sluiten'],
                                                    })
                                                },
                                            })
                                        }}
                                    >
                                        {(form) => (
                                            <form onSubmit={form.handleSubmit}>
                                                <IonItem>
                                                    <FormikField
                                                        form={form}
                                                        label='Code'
                                                        name='code'
                                                        placeholder='Vul hier je spel code in'
                                                        type='text'
                                                    />
                                                </IonItem>

                                                <IonButton expand='block' style={{ marginTop: '1rem' }} type='submit'>Deelnemen aan spel</IonButton>
                                            </form>
                                        )}
                                    </Formik>

                                    {(inGame) && (<IonButton expand="block" style={{marginTop: '1rem'}} onClick={() => router.visit(route('game.index'))}>Terug naar huidig spel</IonButton>)}
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonSegmentContent>

                    <IonSegmentContent id='create'>
                        <IonGrid style={{height: '100%'}}>
                            <IonRow className='ion-justify-content-center ion-align-items-center' style={{height: '100%'}}>
                                <IonCol size='12'>
                                    <Formik
                                        initialValues={{ email: '', password: '', remember: true }}
                                        onSubmit={(values) => {
                                            router.post(route('auth.login'), {
                                                ...values,
                                            }, {
                                                onError: (error) => {
                                                    let errors = '';

                                                    Object.values(error).forEach((error, index) => {
                                                        errors += error;

                                                        if (Object.values(error).length - 1 != index) {
                                                            errors + '\n\n';
                                                        }
                                                    });

                                                    presentAlert({
                                                        header: 'Oops.',
                                                        message: errors,
                                                        buttons: ['Sluiten'],
                                                    })
                                                },
                                            })
                                        }}
                                    >
                                        {(form) => (
                                            <form onSubmit={form.handleSubmit}>
                                                <IonItem>
                                                    <FormikField
                                                        form={form}
                                                        label='Email adres'
                                                        name='email'
                                                        placeholder='j.janneke@example.nl'
                                                        type='text'
                                                    />
                                                </IonItem>

                                                <IonItem>
                                                    <FormikField
                                                        form={form}
                                                        label='Wachtwoord'
                                                        name='password'
                                                        type='password'
                                                    />
                                                </IonItem>

                                                <IonButton expand='block' style={{ marginTop: '1rem' }} type='submit'>Inloggen</IonButton>
                                            </form>
                                        )}
                                    </Formik>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonSegmentContent>
                </IonSegmentView>
            </IonContent>
        </IonicAppLayout>
    );
}