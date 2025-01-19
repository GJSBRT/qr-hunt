import { Badge, Card, CardBody, CardHeader, Col, Container, Row } from "react-bootstrap";

import { Game } from "@/types/game";
import { Power } from "@/types/power";
import { QRCode } from "@/types/qr_code";
import DashboardLayout from "@/Layouts/DashboardLayout";

import PowerWidget from "./Partials/PowerWidget";
import QRCodeWidget from "./Partials/QRCodeWidget";
import UpdateGameCard from "../Partials/UpdateGameCard";

interface Props {
    game: Game,
    qrCodes: QRCode[];
    powers: Power[];
    stats: {
        qrCodes: number,
        powers: number,
    }
}

export default function View({ game, qrCodes, powers, stats }: Props) {
    return (
        <DashboardLayout 
            title={`Spellen - ${game.name}`}
            breadcrumbs={[
                { label: 'Spellen', href: route('dashboard.games.index') },
                { label: game.name, href: route('dashboard.games.view', game.id) },
            ]}
        >
            <Container>
                <Row className="mb-8">
                    <Col lg={3}>
                        <Card>
                            <CardHeader as='h5'>
                                Status
                            </CardHeader>

                            <CardBody>
                                <h4>
                                    {(game.status == 'draft') && <Badge bg='secondary'>Schets</Badge>}
                                    {(game.status == 'not_started') && <Badge bg='info'>Nog niet gestart</Badge>}
                                    {(game.status == 'started') && <Badge bg='success'>Begonnen</Badge>}
                                    {(game.status == 'ended') && <Badge bg='danger'>Afgelopen</Badge>}
                                </h4>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col lg={3}>
                        <Card>
                            <CardHeader as='h5'>
                                Spel/login code
                            </CardHeader>

                            <CardBody>
                                <h4>
                                    {game.code}
                                </h4>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col lg={3}>
                        <Card>
                            <CardHeader as='h5'>
                                QR Codes
                            </CardHeader>

                            <CardBody>
                                <h4>
                                    {stats.qrCodes}
                                </h4>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col lg={3}>
                        <Card>
                            <CardHeader as='h5'>
                                Powers
                            </CardHeader>

                            <CardBody>
                                <h4>
                                    {stats.powers}
                                </h4>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-8">
                    <Col>
                        <UpdateGameCard game={game}/>
                    </Col>
                </Row>

                <Row>
                    <Col lg={6}>
                        <QRCodeWidget game={game} qrCodes={qrCodes} />
                    </Col>

                    <Col lg={6}>
                        <PowerWidget game={game} powers={powers} />
                    </Col>
                </Row>
            </Container>
        </DashboardLayout>
    );
};
