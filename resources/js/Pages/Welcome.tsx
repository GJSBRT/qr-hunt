import '../../css/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Head, Link, router } from "@inertiajs/react";
import { Field, Formik } from "formik";
import { Alert, Button, Container, Form, InputGroup, Row, Stack } from "react-bootstrap";

export default function Welcome({ errors }: { errors: { [key: string]: string } }) {
    return (
        <div className="w-full h-screen grid place-items-center">
            <Head title='Welkom' />

            <Container>
                <Stack className="text-center">
                    <div>
                        <h1>QR Hunt</h1>
                        <p>
                            QR is een spelQR is een spelQR is een spelQR is een spelQR is een spels.
                        </p>
                    </div>

                    {(Object.keys(errors).length > 0) &&
                        <Row className="max-w-xl w-full mx-auto">
                            <Alert variant="danger">
                                <ul className="list-disc text-left">
                                    {Object.entries(errors).map(([field, error]) => <li key={field}>{error}</li>)}
                                </ul>
                            </Alert>
                        </Row>
                    }

                    <Formik
                        initialValues={{ code: '' }}
                        onSubmit={(values) => {
                            router.post(route('game.lobby.join'), {
                                code: values.code
                            })
                        }}
                    >
                        {(form) => (
                            <Form className="max-w-xl mx-auto" onSubmit={form.handleSubmit}>
                                <Field name="code">
                                    {({ field }: { field: any }) => (
                                        <div>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text>Code</InputGroup.Text>
                                                <Form.Control placeholder="123456" {...field} />
                                                <Button type='submit'>Deel mee aan spel</Button>
                                            </InputGroup>
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>

                    <div className="flex gap-4 mx-auto mt-2">
                        <Link href={route('login')}>Inloggen</Link>
                        <Link href={route('register')}>Registeren</Link>
                    </div>
                </Stack>
            </Container>
        </div>
    );
}