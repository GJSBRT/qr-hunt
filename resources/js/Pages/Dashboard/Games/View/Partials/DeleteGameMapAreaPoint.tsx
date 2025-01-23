import { router } from "@inertiajs/react";
import { useState } from "react";
import { Button, ButtonProps, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { Game, GameMapAreaPoint } from '@/types/game';

interface Props extends ButtonProps { 
    game: Game
    gameMapAreaPoint: GameMapAreaPoint;
};

export default function DeleteGameMapAreaPoint({ game, gameMapAreaPoint, ...props }: Props) {
    const [show, setShow] = useState(false);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const submit = function () {
        setSubmitting(true);

        router.delete(route('dashboard.games.map-area-points.delete', {
            id: game.id,
            pointId: gameMapAreaPoint.id,
        }), {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('Coordinaat verwijdered!');
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
                Verwijderen
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Coordinaat verwijderen</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Weet je zeker dat je dit coordinaat wilt verwijderen?</p>
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