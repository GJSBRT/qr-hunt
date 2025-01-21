import * as Yup from 'yup';
import { Game, GAME_STATUS_LANGUAGE } from "@/types/game";
import { router } from "@inertiajs/react";
import { Form, Formik, FormikHelpers } from "formik";
import { Button, Card, CardProps, Col, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import FormikField from '@/Components/DashboardComponentes/FormikField';
import FormikSelect from '@/Components/DashboardComponentes/FormikSelect';
import { QRCode } from '@/types/qr_code';
import { Quartet } from '@/types/quartet';

interface Props extends CardProps {
    game: Game;
    qrCode: QRCode;
    quartet: Quartet;
    categories: {[key: string]: {
        label: string;
        color: string;
    }}
};

const schema = Yup.object({
    category: Yup.string().min(1).required().label('Categorie'),
    value: Yup.number().min(1).required().label('Kaart nummer'),
});

export default function UpdateQuartetCard({ game, qrCode, quartet, categories, ...props }: Props) {
    const submit = function (formData: Quartet, { setSubmitting }: FormikHelpers<Quartet>) {
        router.post(route('dashboard.games.qr-codes.quartets.update', {
            id: game.id,
            qrCodeUuid: qrCode.uuid,
            quartetId: quartet.id
        }), {
            ...formData
        }, {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('Kwartet kaart aangepast!');
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
                    initialValues={quartet}
                    onSubmit={submit}
                >
                    {(form) => (
                        <Form onSubmit={form.handleSubmit}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <FormikField
                                            form={form}
                                            name='value'
                                            label="Kaart nummer"
                                            type='number'
                                            placeholder={`Min 1, max ${game.quartet_values}`}
                                        />
                                    </Col>

                                    <Col>
                                        <FormikSelect
                                            form={form}
                                            name='category'
                                            label="Categorie"
                                        >
                                            {Object.entries(categories).map(([category, value]) => <option key={category} value={category} style={{backgroundColor: value.color}} >{value.label}</option>)}
                                        </FormikSelect>
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
