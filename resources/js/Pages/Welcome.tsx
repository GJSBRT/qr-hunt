
import '../../css/game.css';
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import { Head, Link, router } from "@inertiajs/react";
import { Formik } from "formik";
import { Alert, Form, Row } from "react-bootstrap";
import { IonApp, IonButton, IonCol, IonItem, IonLabel, IonPage, IonRow } from '@ionic/react';
import FormikField from '@/Components/IonicComponents/FormikField';

export default function Welcome({ errors }: { errors: { [key: string]: string } }) {
    return (
        <div className="w-full h-screen grid place-items-center">
            <Head title='Welkom' />

            <IonApp>
                <IonPage className="ion-padding">
                    <IonItem>
                        <IonLabel>
                            <h1>QR Hunt</h1>
                            <p>
                                QR Hunt is een spel waarbij je op jacht gaat op QR codes. Door QR codes te scannen kan je kwartet kaartjes of power up/downs bemachtigen.

                                Het team met alle kwartet setjes of de meeste punten wint!
                            </p>
                        </IonLabel>
                    </IonItem>

                    {(Object.keys(errors).length > 0) &&
                        <Row className="max-w-xl w-full mx-auto">
                            <Alert variant="danger">
                                <ul className="list-disc text-left">
                                    {Object.entries(errors).map(([field, error]) => <li key={field}>{error}</li>)}
                                </ul>
                            </Alert>
                        </Row>
                    }

                    <Formik
                        initialValues={{ code: '' }}
                        onSubmit={(values) => {
                            router.post(route('game.lobby.join'), {
                                code: values.code
                            })
                        }}
                    >
                        {(form) => (
                            <Form className="max-w-xl mx-auto" onSubmit={form.handleSubmit}>
                                <IonItem>
                                    <FormikField
                                        form={form}
                                        label='Code'
                                        name='code'
                                        placeholder='Vul hier je spel code in'
                                        type='text'
                                    />
                                </IonItem>

                                <IonButton style={{ marginTop: '1rem' }} type='submit'>Deel mee aan spel</IonButton>
                            </Form>
                        )}
                    </Formik>

                    <IonRow>
                        <IonCol>
                            <Link href={route('login')}>Inloggen</Link>
                        </IonCol>

                        <IonCol>
                            <Link href={route('register')}>Registeren</Link>
                        </IonCol>
                    </IonRow>
                </IonPage>
            </IonApp>
        </div>
    );
}