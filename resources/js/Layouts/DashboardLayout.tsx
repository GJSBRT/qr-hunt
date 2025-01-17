import '../../css/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Head, Link } from "@inertiajs/react";
import { Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title:          string;
    description?:   string;
}

export default function DashboardLayout({ title, description, children, ...props }: Props) {
    return (
        <>
            <Head title={title} />
            <div {...props}>
                <Navbar expand="lg" data-bs-theme='dark' bg='dark'>
                    <Container>
                        <Navbar.Brand href={route('dashboard')} as={Link}>
                            QR Hunt
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="basic-navbar-nav" />

                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href={route('dashboard')} as={Link}>Home</Nav.Link>
                                <Nav.Link href={route('dashboard.games.index')} as={Link}>Spellen</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <main className="mt-4">
                    <Container>
                        <Row className="mb-2">
                            <h1>{title}</h1>
                            {description && <p>{description}</p>}
                        </Row>
                    </Container>

                    {children}
                </main>
            </div>
        </>
    );
}