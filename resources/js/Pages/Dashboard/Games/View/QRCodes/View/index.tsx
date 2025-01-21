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
import { Quartet } from '@/types/quartet';
import { Power, POWER_TYPE_LANGUAGE } from '@/types/power';
import UpdateQuartetCard from './Partials/UpdateQuartetCard';
import FormikSelect from '@/Components/DashboardComponentes/FormikSelect';

interface Props {
    game: Game
    qrCode: QRCode & {
        quartet: Quartet | null;
        power: Power | null;
    }
    image: string;
    quartetCategories: {
        [key: string]: {
            label: string;
            color: string;
        }
    }
    powers: Power[];
};

const schema = Yup.object({
    description: Yup.string().min(1).max(255).nullable().label('Beschrijving'),
    max_scans: Yup.number().min(1).max(255).nullable().label('Maximale scans'),
    power_id: Yup.number().min(1).max(255).required().label('Power'),
});

export default function QRCodes({ game, qrCode, image, quartetCategories, powers }: Props) {
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
                                initialValues={qrCode as QRCode}
                                onSubmit={submit}
                            >
                                {(form) => (
                                    <Form onSubmit={form.handleSubmit}>
                                        <Card.Body>
                                            <FormikField
                                                form={form}
                                                name='description'
                                                label="Beschrijving (zichtbaar voor spelers)"
                                                placeholder="Iets van een geheugensteuntje."
                                            />

                                            <FormikField
                                                form={form}
                                                name='max_scans'
                                                label="Maximale scans (Optioneel)"
                                                type='number'
                                                placeholder="Maximaal aantal scans? Altijd 1 per team."
                                            />

                                            <FormikSelect
                                                form={form}
                                                name='power_id'
                                                label="Power"
                                            >
                                                <option value=''>Geen power</option>
                                                {powers.map((power) => <option key={power.id} value={power.id}>{power.description ?? POWER_TYPE_LANGUAGE[power.type] ?? 'Onbekende power'}</option>)}
                                            </FormikSelect>
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

                {(qrCode.quartet && !qrCode.power) && (
                    <>
                        <div className='mt-8'>
                            <h2>Kwartet</h2>
                            <p>Hier kan je de kwartet instellingen van deze QR code wijzigen.</p>
                        </div>

                        <Row>
                            <Col>
                                <UpdateQuartetCard game={game} qrCode={qrCode} quartet={qrCode.quartet} categories={quartetCategories} />
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </DashboardLayout>
    );
};
