import { router } from "@inertiajs/react";
import { useState } from "react";
import { Button, ButtonProps, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { Game } from '@/types/game';
import { Power } from "@/types/power";

interface Props extends ButtonProps { 
    game: Game
    power: Power;
};

export default function DeletePowerButton({ game, power, ...props }: Props) {
    const [show, setShow] = useState(false);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const submit = function () {
        setSubmitting(true);

        router.delete(route('dashboard.games.powers.delete', {
            id: game.id,
            powerId: power.id,
        }), {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('Power verwijdered!');
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
                Power verwijderen
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Power verwijderen</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Weet je zeker dat je deze power wilt verwijderen? Alle gekoppelde QR codes zullen dan geen power meer hebben.</p>
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