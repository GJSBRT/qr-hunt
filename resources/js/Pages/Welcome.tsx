import { Head, Link } from "@inertiajs/react";
import { Button, Container, Form, InputGroup, Row, Stack } from "react-bootstrap";

export default function Welcome() {
    return (
        <div className="w-full h-screen grid place-items-center">
            <Head title='Welkom'/>

            <Container>
                <Stack className="text-center">
                    <div>
                        <h1>QR Hunt</h1>
                        <p>
                            QR is een spelQR is een spelQR is een spelQR is een spelQR is een spels.
                        </p>
                    </div>

                    <form className="max-w-xl mx-auto">
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">Code</InputGroup.Text>
                            <Form.Control placeholder="123456"/>
                            <Button>Deel mee aan spel</Button>
                        </InputGroup>
                    </form>

                    <div className="flex gap-4 mx-auto mt-2">
                        <Link href={route('login')}>Inloggen</Link>
                        <Link href={route('register')}>Registeren</Link>
                    </div>
                </Stack>
            </Container>
        </div>
    );
}