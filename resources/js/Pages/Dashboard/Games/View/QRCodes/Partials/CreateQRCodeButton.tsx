import * as Yup from 'yup';
import FormikField from "@/Components/DashboardComponentes/FormikField";
import { router } from "@inertiajs/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { Button, ButtonProps, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { NewQRCode } from '@/types/qr_code';
import { Game } from '@/types/game';

interface Props extends ButtonProps { 
    game: Game
}

// TODO: Add power
const initialValues: NewQRCode = {
    description:    '',
    max_scans:      null,
};

const schema = Yup.object({
    description: Yup.string().min(1).max(255).nullable().label('Beschrijving'),
    max_scans: Yup.number().min(1).max(255).nullable().label('Maximale scans'),
});

export default function CreateQRCodeButton({ game, ...props }: Props) {
    const [show, setShow] = useState(false);

    const submit = function (formData: NewQRCode, { setSubmitting }: FormikHelpers<NewQRCode>) {
        router.post(route('dashboard.games.qr-codes.create', game.id), {
            ...formData
        }, {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('QR code aangemaakt!');
                router.reload();
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
                QR code aanmaken
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nieuwe QR code</Modal.Title>
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
                                    name='description'
                                    label="Beschrijving (Optioneel, als je durft)"
                                    placeholder="Iets van een geheugensteuntje."
                                />

                                <FormikField
                                    form={form}
                                    name='max_scans'
                                    label="Maximale scans (Optioneel)"
                                    type='number'
                                    placeholder="Maximaal aantal scans? Altijd 1 per team."
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