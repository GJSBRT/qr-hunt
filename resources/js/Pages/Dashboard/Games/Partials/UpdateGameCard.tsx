import * as Yup from 'yup';
import { Game, GAME_STATUS_LANGUAGE } from "@/types/game";
import { router } from "@inertiajs/react";
import { Form, Formik, FormikHelpers } from "formik";
import { Button, Card, CardProps, Col, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import FormikField from '@/Components/DashboardComponentes/FormikField';
import FormikCheckbox from '@/Components/DashboardComponentes/FormikCheckbox';
import FormikSelect from '@/Components/DashboardComponentes/FormikSelect';

interface Props extends CardProps {
    game: Game;
};

const schema = Yup.object({
    name: Yup.string().min(2).max(255).required().label('Naam'),
    code: Yup.string().min(2).max(255).required().label('Code'),
    play_duration: Yup.number().min(60).max(21600).nullable().label('Spel duratie'),
    cooldown_duration: Yup.number().min(5).max(3600).nullable().label('QR scan afkoel tijd'),
    quartet_categories: Yup.number().min(1).max(30).required().label('Kwartet categorien'),
    quartet_values: Yup.number().min(1).max(5).required().label('Kwartet kaarten'),
    show_results: Yup.boolean().required().label('Laat eind resultaat zien'),
    start_lat: Yup.number().nullable().label('Start lat'),
    start_lng: Yup.number().nullable().label('Start lng'),
});

export default function UpdateGameCard({ game, ...props }: Props) {
    const submit = function (formData: Game, { setSubmitting }: FormikHelpers<Game>) {
        router.put(route('dashboard.games.update', game.id), {
            ...formData
        }, {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('Power aangemaakt!');
                router.reload();
            },
            onError: (error) => {
                let errors = '';

                Object.values(error).forEach((error, index) => {
                    errors += error;

                    if (Object.values(error).length - 1 != index) {
                        errors + '\n\n';
                    }
                });

                toast.error(errors);
            },
        });
    };

    return (
        <>
            <Card {...props}>
                <Card.Header as='h5'>
                    Gegevens
                </Card.Header>

                <Formik
                    validationSchema={schema}
                    initialValues={game}
                    onSubmit={submit}
                >
                    {(form) => (
                        <Form onSubmit={form.handleSubmit}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <FormikField
                                            form={form}
                                            name='name'
                                            label="Naam"
                                            placeholder="Iets van een naam voor dit spel."
                                        />
                                    </Col>

                                    <Col>
                                        <FormikField
                                            form={form}
                                            name='code'
                                            label="Code"
                                            placeholder="Met deze code kunnen spelers meedoen."
                                        />
                                    </Col>

                                    <Col>
                                        <FormikField
                                            form={form}
                                            name='play_duration'
                                            label="Maximale duur (Optioneel)"
                                            type='number'
                                            placeholder="Hoelang in seconded duurt dit spel?"
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <FormikField
                                            form={form}
                                            name='cooldown_duration'
                                            label="QR scan afkoel tijd (Optioneel)"
                                            type='number'
                                            placeholder="Hoelang moet een team wachten tussen het scannen?"
                                        />
                                    </Col>

                                    <Col>
                                        <FormikField
                                            form={form}
                                            name='quartet_categories'
                                            label="Aantal kwartet categorien"
                                            type='number'
                                            placeholder="Min 1, max 30"
                                        />
                                    </Col>

                                    <Col>
                                        <FormikField
                                            form={form}
                                            name='quartet_values'
                                            label="Hoeveel kaarten per kwartet set"
                                            type='number'
                                            placeholder="Min 1, max 5"
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <FormikCheckbox
                                            form={form}
                                            name='show_results'
                                            label="Laat het eind resultaat zien als het spel voorbij is."
                                        />
                                    </Col>

                                    <Col>
                                        <FormikSelect
                                            form={form}
                                            name='status'
                                            label="Status"
                                        >
                                            {Object.entries(GAME_STATUS_LANGUAGE).map(([status, label]) => <option key={status} value={status}>{label}</option>)}
                                        </FormikSelect>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <FormikField
                                            form={form}
                                            name='start_lat'
                                            label="Start latitude"
                                            type='decimal'
                                        />
                                    </Col>

                                    <Col>
                                        <FormikField
                                            form={form}
                                            name='start_lng'
                                            label="Start longitiude"
                                            type='decimal'
                                        />
                                    </Col>
                                </Row>
                            </Card.Body>

                            <Card.Footer>
                                <Button variant="primary" type='submit' disabled={form.isSubmitting}>
                                    Opslaan
                                </Button>
                            </Card.Footer>
                        </Form>
                    )}
                </Formik>
            </Card>
        </>
    );
};
