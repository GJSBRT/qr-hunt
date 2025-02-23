import { Card, CardBody, CardHeader, Col, Container, Row, Table } from "react-bootstrap";

import { Game } from "@/types/game";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { TeamPointsModifier, Team } from '@/types/team';

import DeletePowerButton from '../Partials/DeleteTeamButton';
import DeleteTeamPointsModifier from "./Partials/DeleteTeamPointsModifier";
import CreateTeamPointsModifier from "./Partials/CreateTeamPointsModifier";
import { Link } from "@inertiajs/react";

interface Props {
    game: Game
    team: Team
    teamPointsModifiers: TeamPointsModifier[];
    stats: {
        teamQRCodes: number;
    }
};


export default function View({ game, team, teamPointsModifiers, stats }: Props) {
    return (
        <DashboardLayout
            title={`${game.name} - ${team.name}`}
            headerSlot={<DeletePowerButton game={game} team={team} />}
            breadcrumbs={[
                { label: 'Spellen', href: route('dashboard.games.index') },
                { label: game.name, href: route('dashboard.games.view', game.id) },
                { label: 'Teams', href: route('dashboard.games.teams.index', game.id) },
                { label: 'Team', href: route('dashboard.games.teams.view', { id: game.id, teamId: team.id }) },
            ]}
        >
            <Container>
                <Row className="mb-8">
                    <Col lg={3}>
                        <Card as={Link} href={route('dashboard.games.teams.qr-codes.index', {
                            id: game.id,
                            teamId: team.id,
                        })}>
                            <CardHeader as='h5'>
                                QR Codes gevonden
                            </CardHeader>

                            <CardBody>
                                <h4>
                                    {stats.teamQRCodes}
                                </h4>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                <div className="flex justify-between">
                    <h2>Punten modificators</h2>

                    <div>
                        <CreateTeamPointsModifier game={game} team={team}/>
                    </div>
                </div>

                <Row>
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Hoeveelheid</th>
                                <th>Verwijderen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(teamPointsModifiers.length == 0) &&
                                <tr>
                                    <td colSpan={3}>Geen resultaten</td>
                                </tr>
                            }

                            {teamPointsModifiers.map((teamPointsModifier) => (
                                <tr key={teamPointsModifier.id}>
                                    <td>{teamPointsModifier.type == 'add' ? "Toevoegen" : "Aftrekken"}</td>
                                    <td>{teamPointsModifier.amount}</td>
                                    <td><DeleteTeamPointsModifier game={game} team={team} teamPointsModifier={teamPointsModifier} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        </DashboardLayout >
    );
};
