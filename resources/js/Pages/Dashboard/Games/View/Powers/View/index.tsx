import * as Yup from 'yup';
import FormikField from "@/Components/DashboardComponentes/FormikField";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Game } from "@/types/game";
import { router } from "@inertiajs/react";
import { Form, Formik, FormikHelpers } from "formik";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { Power } from '@/types/power';
import DeletePowerButton from '../Partials/DeletePowerButton';

interface Props {
    game: Game
    power: Power
};

const schema = Yup.object({
    description: Yup.string().min(1).max(255).nullable().label('Beschrijving'),
    max_scans: Yup.number().min(1).max(255).nullable().label('Maximale scans'),
});

export default function View({ game, power }: Props) {
    const submit = function (formData: Power, { setSubmitting }: FormikHelpers<Power>) {
        router.put(route('dashboard.games.powers.update', {
            id: game.id,
            powerId: power.id,
        }), {
            ...formData
        }, {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('Power aangepast!');
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
        <DashboardLayout
            title={`${game.name} - Power`}
            description={power.description ?? undefined}
            headerSlot={<DeletePowerButton game={game} power={power} />}
            breadcrumbs={[
                { label: 'Spellen', href: route('dashboard.games.index') },
                { label: game.name, href: route('dashboard.games.view', game.id) },
                { label: 'Powers', href: route('dashboard.games.powers.index', game.id) },
                { label: 'Power', href: route('dashboard.games.powers.view', { id: game.id, powerId: power.id }) },
            ]}
        >
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>Gegevens wijzigen</Card.Header>
                            <Formik
                                validationSchema={schema}
                                initialValues={power}
                                onSubmit={submit}
                            >
                                {(form) => (
                                    <Form onSubmit={form.handleSubmit}>
                                        <Card.Body>
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
                                        </Card.Body>

                                        <Card.Footer>
                                            <Button variant="primary" type='submit' disabled={form.isSubmitting || !form.dirty}>
                                                Opslaan
                                            </Button>
                                        </Card.Footer>
                                    </Form>
                                )}
                            </Formik>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </DashboardLayout >
    );
};
