import { router } from "@inertiajs/react";
import { useState } from "react";
import { Button, ButtonProps, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { QRCode } from '@/types/qr_code';
import { Game } from '@/types/game';

interface Props extends ButtonProps { 
    game: Game
    qrCode: QRCode;
};

export default function DeleteQRCodeButton({ game, qrCode, ...props }: Props) {
    const [show, setShow] = useState(false);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const submit = function () {
        setSubmitting(true);

        router.delete(route('dashboard.games.qr-codes.delete', {
            id: game.id,
            qrCodeUuid: qrCode.uuid,
        }), {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('QR code verwijdered!');
                setShow(false);
            },
            onError: (error) => {
                let errors = '';

                Object.values(error).forEach((error, index) => {
                    errors += error;

                    if (Object.values(error).length - 1 != index) {
                        errors + '\n\n';
                    }
                });

                toast.error(errors);
            },
        });
    }

    return (
        <>
            <Button variant='danger' onClick={() => setShow(true)} {...props}>
                QR code verwijderen
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>QR code verwijderen</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Weet je zeker dat je deze QR code wilt verwijderen?</p>

                    {qrCode.description && <p>Beschrijving: {qrCode.description}</p>}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Annuleren
                    </Button>

                    <Button variant="danger" onClick={submit} disabled={isSubmitting}>
                        Verwijderen
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};