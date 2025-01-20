import { useState } from "react";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import { Button, ButtonProps, Modal } from "react-bootstrap";

import { Game } from '@/types/game';
import { Team } from "@/types/team";

interface Props extends ButtonProps { 
    game: Game
    team: Team;
};

export default function DeleteTeamButton({ game, team, ...props }: Props) {
    const [show, setShow] = useState(false);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const submit = function () {
        setSubmitting(true);

        router.delete(route('dashboard.games.teams.delete', {
            id: game.id,
            teamId: team.id,
        }), {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('Team verwijdered!');
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
                Team verwijderen
            </Button>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Team verwijderen</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Weet je zeker dat je dit team wilt verwijderen? Alle gekoppelde scores, spelers, etc gaan verloren.</p>
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