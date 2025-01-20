import * as Yup from 'yup';
import FormikField from "@/Components/DashboardComponentes/FormikField";
import { NewGame } from "@/types/game";
import { router } from "@inertiajs/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { Button, ButtonProps, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import FormikCheckbox from '@/Components/DashboardComponentes/FormikCheckbox';

interface Props extends ButtonProps { }

const initialValues: NewGame = {
    name: '',
    code: '',
    play_duration: null,
    cooldown_duration: null,
    start_lat: null,
    start_lng: null,
    quartet_categories: 5,
    quartet_values: 5,
    show_results: true,
};

const schema = Yup.object({
    name: Yup.string().min(2).max(255).required().label('Naam'),
    code: Yup.string().min(2).max(255).required().label('Code'),
    play_duration: Yup.number().min(60).max(21600).nullable().label('Spel duratie'),
    cooldown_duration: Yup.number().min(5).max(3600).nullable().label('QR scan afkoel tijd'),
    quartet_categories: Yup.number().min(1).max(30).required().label('Kwartet categorien'),
    quartet_values: Yup.number().min(1).max(5).required().label('Kwartet kaarten'),
    show_results: Yup.boolean().required().label('Laat eind resultaat zien'),
});

export default function CreateGameButton({ ...props }: Props) {
    const [show, setShow] = useState(false);


    const submit = function (formData: NewGame, { setSubmitting }: FormikHelpers<NewGame>) {
        router.post(route('dashboard.games.create'), {
            ...formData
        }, {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('Spel aangemaakt!');
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
    }

    return (
        <>
            <Button onClick={() => setShow(true)} {...props}>
                Spel aanmaken
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nieuw spel</Modal.Title>
                </Modal.Header>

                <Formik
                    validationSchema={schema}
                    initialValues={initialValues}
                    onSubmit={submit}
                >
                    {(form) => (
                        <Form onSubmit={form.handleSubmit}>
                            <Modal.Body>
                                <FormikField
                                    form={form}
                                    name='name'
                                    label="Naam"
                                    placeholder="Iets van een naam voor dit spel."
                                />

                                <FormikField
                                    form={form}
                                    name='code'
                                    label="Code"
                                    placeholder="Met deze code kunnen spelers meedoen."
                                />

                                <FormikField
                                    form={form}
                                    name='play_duration'
                                    label="Maximale duur (Optioneel)"
                                    type='number'
                                    placeholder="Hoelang in seconded duurt dit spel?"
                                />

                                <FormikField
                                    form={form}
                                    name='cooldown_duration'
                                    label="QR scan afkoel tijd (Optioneel)"
                                    type='number'
                                    placeholder="Hoelang moet een team wachten tussen het scannen?"
                                />

                                <FormikField
                                    form={form}
                                    name='quartet_categories'
                                    label="Aantal kwartet categorien"
                                    type='number'
                                    placeholder="Min 1, max 30"
                                />

                                <FormikField
                                    form={form}
                                    name='quartet_values'
                                    label="Hoeveel kaarten per kwartet set"
                                    type='number'
                                    placeholder="Min 1, max 5"
                                />

                                <FormikCheckbox
                                    form={form}
                                    name='show_results'
                                    label="Laat het eind resultaat zien als het spel voorbij is."
                                />
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShow(false)}>
                                    Annuleren
                                </Button>

                                <Button variant="primary" type='submit' disabled={form.isSubmitting}>
                                    Aanmaken
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    );
};