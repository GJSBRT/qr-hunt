import * as Yup from 'yup';
import FormikField from "@/Components/DashboardComponentes/FormikField";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Game } from "@/types/game";
import { QRCode } from "@/types/qr_code";
import { router } from "@inertiajs/react";
import { Form, Formik, FormikHelpers } from "formik";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import DeleteQRCodeButton from '../Partials/DeleteQRCodeButton';

interface Props {
    game: Game
    qrCode: QRCode
    image: string;
};

const schema = Yup.object({
    description: Yup.string().min(1).max(255).nullable().label('Beschrijving'),
    max_scans: Yup.number().min(1).max(255).nullable().label('Maximale scans'),
});

export default function QRCodes({ game, qrCode, image }: Props) {
    const submit = function (formData: QRCode, { setSubmitting }: FormikHelpers<QRCode>) {
        router.put(route('dashboard.games.qr-codes.update', {
            id: game.id,
            qrCodeUuid: qrCode.uuid,
        }), {
            ...formData
        }, {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('QR code aangepast!');
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
            title={`${game.name} - QR Code`}
            description={qrCode.description}
            headerSlot={<DeleteQRCodeButton game={game} qrCode={qrCode} />}
            breadcrumbs={[
                { label: 'Games', href: route('dashboard.games.index') },
                { label: game.name, href: route('dashboard.games.view', game.id) },
                { label: 'QR Codes', href: route('dashboard.games.qr-codes.index', game.id) },
                { label: 'QR Code', href: route('dashboard.games.qr-codes.view', { id: game.id, qrCodeUuid: qrCode.uuid }) },
            ]}
        >
            <Container>
                <Row>
                    <Col md={3}>
                        <Card>
                            <Card.Header>QR Code</Card.Header>
                            <Card.Body>
                                <img src={'data:image/png;base64,' + image} />
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={9}>
                        <Card>
                            <Card.Header>Gegevens wijzigen</Card.Header>
                            <Formik
                                validationSchema={schema}
                                initialValues={qrCode}
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
        </DashboardLayout>
    );
};
