import { router } from "@inertiajs/react";
import { Badge, Card, CardBody, CardHeader, CardTitle, Col, Container, Row } from "react-bootstrap";

import DashboardLayout from "@/Layouts/DashboardLayout";
import { Game, GAME_STATUS_LANGUAGE } from "@/types/game";

export default function View({ game }: { game: Game }) {
    return (
        <DashboardLayout title={`Spellen - ${game.name}`}>
            <Container>
                <Row>
                    <Col>
                        <Card>
                            <CardHeader >
                                <CardTitle>Status</CardTitle>
                            </CardHeader>

                            <CardBody>
                                <h4>
                                    {(game.status == 'not_started') && <Badge bg='secondary'>Nog niet gestart</Badge>}
                                    {(game.status == 'started') && <Badge bg='success'>Begonnen</Badge>}
                                    {(game.status == 'ended') && <Badge bg='danger'>Afgelopen</Badge>}
                                </h4>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col>
                        <Card>
                            <CardHeader >
                                <CardTitle>Code</CardTitle>
                            </CardHeader>

                            <CardBody>
                                <h4>
                                    {game.code}
                                </h4>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </DashboardLayout>
    );
};
