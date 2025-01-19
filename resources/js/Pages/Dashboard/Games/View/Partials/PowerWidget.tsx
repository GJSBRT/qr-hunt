import { Game } from "@/types/game";
import { QRCode } from "@/types/qr_code";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@inertiajs/react";
import { Button, Card, Col, ListGroup, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import CreateQRCodeButton from "../QRCodes/Partials/CreateQRCodeButton";
import { Power } from "@/types/power";
import CreatePowerButton from "../Powers/Partials/CreatePowerButton";

interface Props {
    game: Game;
    powers: Power[];
};

export default function PowerWidget({ game, powers }: Props) {
    return (
        <Card>
            <Card.Header>
                <Row>
                    <Col className='flex items-center'>
                        <h5 className="mb-0">Powers</h5>
                    </Col>

                    <Col className="flex justify-end">
                        <OverlayTrigger overlay={<Tooltip>Bekijk alle Powers</Tooltip>}>
                            <Button size='sm' as={Link as any} href={route('dashboard.games.powers.index', game.id)}>
                                <FontAwesomeIcon icon={faEye} />
                            </Button>
                        </OverlayTrigger>
                    </Col>
                </Row>
            </Card.Header>

            <ListGroup variant="flush">
                {(powers.length == 0) && (
                    <Card.Body>
                        <Card.Title>Geen powers</Card.Title>

                        <Card.Text>
                            Je hebt nog geen powers aangemaakt!
                        </Card.Text>

                        <CreatePowerButton game={game} />
                    </Card.Body>
                )}
                {powers.map(power => (
                    <ListGroup.Item key={power.id} as={Link} href={route('dashboard.games.powers.view', {
                        id: game.id,
                        powerId: power.id,
                    })}>
                        <div className="me-auto">
                            <div className={`fw-bold ${!power.description && 'italic'}`}>{power.description ?? 'Geen beschrijving'}</div>
                            {power.id}
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
};