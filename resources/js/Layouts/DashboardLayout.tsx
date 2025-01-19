import '../../css/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from 'react-hot-toast';
import { Head, Link } from "@inertiajs/react";
import { Breadcrumb, Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import { ReactNode } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    headerSlot?: ReactNode;
    breadcrumbs?: Array<{
        label: string;
        href: string;
    }>
}

export default function DashboardLayout({ title, description, headerSlot, children, breadcrumbs, ...props }: Props) {
    return (
        <>
            <Head title={title} />

            <Toaster
                toastOptions={{
                    duration: 5000,
                }}
            />

            <div {...props}>
                <Navbar expand="lg" data-bs-theme='dark' bg='dark'>
                    <Container>
                        <Navbar.Brand href={route('dashboard')} as={Link}>
                            QR Hunt
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="basic-navbar-nav" />

                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link active={route().current('dashboard')} href={route('dashboard')} as={Link}>Home</Nav.Link>
                                <Nav.Link active={route().current('dashboard.games.*')} href={route('dashboard.games.index')} as={Link}>Spellen</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <main className="mt-4">
                    <Container>
                        <div className="mb-2 flex flex-row justify-between items-center">
                            <div>
                                <h1>{title}</h1>
                                {description && <p>{description}</p>}
                            </div>

                            {headerSlot &&
                                <div>
                                    {headerSlot}
                                </div>
                            }
                        </div>

                        {breadcrumbs &&
                            <Breadcrumb>
                                <Breadcrumb.Item active={route().current('dashboard')} href={route('dashboard')} as={Link}>Home</Breadcrumb.Item>

                                {breadcrumbs.map(breadcrumb => (
                                    <Breadcrumb.Item key={breadcrumb.label} active={window.location.href == breadcrumb.href} href={breadcrumb.href} as={Link}>{breadcrumb.label}</Breadcrumb.Item>
                                ))}
                            </Breadcrumb>
                        }
                    </Container>

                    {children}
                </main>
            </div>
        </>
    );
};
