import * as Yup from 'yup';
import FormikField from "@/Components/DashboardComponentes/FormikField";
import { router } from "@inertiajs/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { Button, ButtonProps, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { Game, NewGameMapAreaPoint } from '@/types/game';
import { Team } from '@/types/team';

interface Props extends ButtonProps {
    game: Game;
}

const initialValues: NewGameMapAreaPoint = {
    lat: 0,
    lng: 0,
};

const schema = Yup.object({
    lat: Yup.number().required().label('Lat'),
    lng: Yup.number().required().label('Lng'),
});

export default function CreateGameMapAreaPoint({ game, ...props }: Props) {
    const [show, setShow] = useState(false);

    const submit = function (formData: NewGameMapAreaPoint, { setSubmitting }: FormikHelpers<NewGameMapAreaPoint>) {
        router.post(route('dashboard.games.map-area-points.create', {
            id: game.id,
        }), {
            ...formData
        }, {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('Coordinaat toegevoegd!');
                setShow(false);
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
                Coordinaat toevoegen
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nieuwe coordinaat</Modal.Title>
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
                                    name='lat'
                                    label="Latitude"
                                    type='decimal'
                                />

                                <FormikField
                                    form={form}
                                    name='lng'
                                    label="Longitude"
                                    type='decimal'
                                />
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShow(false)}>
                                    Annuleren
                                </Button>

                                <Button variant="primary" type='submit' disabled={form.isSubmitting}>
                                    Toevoegen
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    );
};