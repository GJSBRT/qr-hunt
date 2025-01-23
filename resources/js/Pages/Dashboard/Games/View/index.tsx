import { Link } from "@inertiajs/react";
import { Badge, Card, CardBody, CardHeader, Col, Container, Row, Table } from "react-bootstrap";

import { Game, GameMapAreaPoint } from "@/types/game";
import DashboardLayout from "@/Layouts/DashboardLayout";

import UpdateGameCard from "../Partials/UpdateGameCard";
import CreateGameMapAreaPoint from "./Partials/CreateGameMapAreaPoint";
import DeleteGameMapAreaPoint from "./Partials/DeleteGameMapAreaPoint";

interface Props {
    game: Game,
    gameMapAreaPoints: GameMapAreaPoint[];
    stats: {
        qrCodes: number,
        powers: number,
        teams: number,
    }
}

export default function View({ game, gameMapAreaPoints, stats }: Props) {
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
                        <Card as={Link} href={route('dashboard.games.qr-codes.index', game.id)}>
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
                        <Card as={Link} href={route('dashboard.games.powers.index', game.id)}>
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
                    <Col lg={3}>
                        <Card as={Link} href={route('dashboard.games.teams.index', game.id)}>
                            <CardHeader as='h5'>
                                Teams
                            </CardHeader>

                            <CardBody>
                                <h4>
                                    {stats.teams}
                                </h4>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col lg={3}>
                        <Card as={Link} href={route('dashboard.games.powers.index', game.id)}>
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

                <Row className="mt-8">
                    <Col>
                        <UpdateGameCard game={game} />
                    </Col>
                </Row>

                <div className="flex justify-between mt-8">
                    <h2>Spel veld coordinaten</h2>

                    <div>
                        <CreateGameMapAreaPoint game={game}/>
                    </div>
                </div>

                <Row>
                    <Col>
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {(gameMapAreaPoints.length == 0) &&
                                    <tr>
                                        <td colSpan={4}>Geen resultaten</td>
                                    </tr>
                                }

                                {gameMapAreaPoints.map(gameMapAreaPoint => (
                                    <tr key={gameMapAreaPoint.id}>
                                        <td>{gameMapAreaPoint.id}</td>
                                        <td>{gameMapAreaPoint.lat}</td>
                                        <td>{gameMapAreaPoint.lng}</td>
                                        <td>
                                            <DeleteGameMapAreaPoint size='sm' game={game} gameMapAreaPoint={gameMapAreaPoint}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </DashboardLayout>
    );
};
