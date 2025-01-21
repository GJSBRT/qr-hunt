import * as Yup from 'yup';
import FormikField from "@/Components/DashboardComponentes/FormikField";
import { router } from "@inertiajs/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { Button, ButtonProps, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { Game } from '@/types/game';
import { NewPower } from '@/types/power';
import FormikSelect from '@/Components/DashboardComponentes/FormikSelect';
import FormikCheckbox from '@/Components/DashboardComponentes/FormikCheckbox';

interface Props extends ButtonProps { 
    game: Game;
    types: {[key: string]: string}
}

const initialValues: NewPower = {
    power_up: false,
    description: null,
    related_to_other_team: false,
    type: 'message',
    extra_fields: {}
};

const schema = Yup.object({
    power_up: Yup.bool().label('Power up'),
    related_to_other_team: Yup.bool().label('Gerelateerd aan andere teams'),
    description: Yup.string().min(1).max(255).nullable().label('Beschrijving'),
    type: Yup.string().required().label('Type'),
});

export default function CreatePowerButton({ game, types, ...props }: Props) {
    const [show, setShow] = useState(false);

    const submit = function (formData: NewPower, { setSubmitting }: FormikHelpers<NewPower>) {
        router.post(route('dashboard.games.powers.create', game.id), {
            ...formData
        }, {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('Power aangemaakt!');
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
                Power aanmaken
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nieuwe Power</Modal.Title>
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
                                    label="Beschrijving (ook zichtbaar voor spelers)"
                                    placeholder="Iets van een geheugensteuntje."
                                />

                                <FormikCheckbox
                                    form={form}
                                    name='power_up'
                                    label="Is dit een power up? (anders power down)"
                                />

                                <FormikCheckbox
                                    form={form}
                                    name='related_to_other_team'
                                    label="Is deze power gerelateerd aan andere teams?"
                                />

                                <FormikSelect
                                    form={form}
                                    name='type'
                                    label="Type"
                                >
                                    {Object.entries(types).map(([type, label]) => (<option key={type} value={type}>{label}</option>))}
                                </FormikSelect>

                                {(form.values.type == 'message') && (
                                    <FormikField
                                        form={form}
                                        name='extra_fields.message'
                                        label="Bericht"
                                        placeholder='Het bericht wat je wilt tonen.'
                                    />
                                )}

                                {(form.values.type == 'scan_freeze') && (
                                    <FormikField
                                        form={form}
                                        name='extra_fields.duration'
                                        label="Duratie"
                                        placeholder='Hoelang duurt de scan freeze in seconden?'
                                        type='number'
                                    />
                                )}
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