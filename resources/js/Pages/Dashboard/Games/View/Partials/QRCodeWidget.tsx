import { Game } from "@/types/game";
import { QRCode } from "@/types/qr_code";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@inertiajs/react";
import { Button, Card, Col, ListGroup, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import CreateQRCodeButton from "../QRCodes/Partials/CreateQRCodeButton";

interface Props {
    game: Game;
    qrCodes: QRCode[];
};

export default function QRCodeWidget({ game, qrCodes }: Props) {
    return (
        <Card>
            <Card.Header>
                <Row>
                    <Col className='flex items-center'>
                        <h5 className="mb-0">QR Codes</h5>
                    </Col>

                    <Col className="flex justify-end">
                        <OverlayTrigger overlay={<Tooltip>Bekijk alle QR Codes</Tooltip>}>
                            <Button size='sm' as={Link as any} href={route('dashboard.games.qr-codes.index', game.id)}>
                                <FontAwesomeIcon icon={faEye} />
                            </Button>
                        </OverlayTrigger>
                    </Col>
                </Row>
            </Card.Header>

            <ListGroup variant="flush">
                {(qrCodes.length == 0) && (
                    <Card.Body>
                        <Card.Title>Geen QR codes</Card.Title>

                        <Card.Text>
                            Je hebt nog geen QR codes aangemaakt!
                        </Card.Text>

                        <CreateQRCodeButton game={game} />
                    </Card.Body>
                )}
                {qrCodes.map(qrCode => (
                    <ListGroup.Item key={qrCode.uuid} as={Link} href={route('dashboard.games.qr-codes.view', {
                        id: game.id,
                        qrCodeUuid: qrCode.uuid,
                    })}>
                        <div className="me-auto">
                            <div className={`fw-bold ${!qrCode.description && 'italic'}`}>{qrCode.description ?? 'Geen beschrijving'}</div>
                            {qrCode.uuid}
                        </div>
                        
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
};