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
import FormikCheckbox from '@/Components/DashboardComponentes/FormikCheckbox';
import FormikSelect from '@/Components/DashboardComponentes/FormikSelect';

interface Props {
    game: Game
    power: Power
    types: {[key: string]: string}
};

const schema = Yup.object({
    power_up: Yup.bool().label('Power up'),
    related_to_other_team: Yup.bool().label('Gerelateerd aan andere teams'),
    description: Yup.string().min(1).max(255).nullable().label('Beschrijving'),
    type: Yup.string().required().label('Type'),
});

export default function View({ game, power, types }: Props) {
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
