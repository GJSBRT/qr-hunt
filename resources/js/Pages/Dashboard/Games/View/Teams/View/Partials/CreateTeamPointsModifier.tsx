import * as Yup from 'yup';
import FormikField from "@/Components/DashboardComponentes/FormikField";
import { router } from "@inertiajs/react";
import { Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { Button, ButtonProps, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { Game } from '@/types/game';
import { NewTeamPointsModifier, Team } from '@/types/team';
import FormikSelect from '@/Components/DashboardComponentes/FormikSelect';

interface Props extends ButtonProps {
    game: Game;
    team: Team;
}

const initialValues: NewTeamPointsModifier = {
    type: 'add',
    amount: 0,
};

const schema = Yup.object({
    type: Yup.string().required().label('Type modificator'),
    amount: Yup.number().min(1).required().label('Hoeveelheid'),
});

export default function CreateTeamPointsModifier({ game, team, ...props }: Props) {
    const [show, setShow] = useState(false);

    const submit = function (formData: NewTeamPointsModifier, { setSubmitting }: FormikHelpers<NewTeamPointsModifier>) {
        router.post(route('dashboard.games.teams.points-modifiers.create', {
            id: game.id,
            teamId: team.id
        }), {
            ...formData
        }, {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('Punten modificator aangemaakt!');
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
                Modificator aanmaken
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nieuwe punten modificator</Modal.Title>
                </Modal.Header>

                <Formik
                    validationSchema={schema}
                    initialValues={initialValues}
                    onSubmit={submit}
                >
                    {(form) => (
                        <Form onSubmit={form.handleSubmit}>
                            <Modal.Body>
                                <p>
                                    Met een punten modificator can je punten toe af afwijzen van een team. Handig als iemand vals speelt of als iemand pech had oid.
                                </p>

                                <FormikSelect
                                    form={form}
                                    name='type'
                                    label="Type"
                                >
                                    <option value='add'>Toevoegen</option>
                                    <option value='remove'>Aftrekken</option>
                                </FormikSelect>

                                <FormikField
                                    form={form}
                                    name='amount'
                                    label="Hoeveelheid"
                                    type='number'
                                    placeholder="De hoeveelheid om toe te voegen bijvoorbeeld."
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