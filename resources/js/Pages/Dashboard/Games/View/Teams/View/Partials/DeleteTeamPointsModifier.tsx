import { router } from "@inertiajs/react";
import { useState } from "react";
import { Button, ButtonProps, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { Game } from '@/types/game';
import { Team, TeamPointsModifier } from "@/types/team";

interface Props extends ButtonProps { 
    game: Game
    team: Team;
    teamPointsModifier: TeamPointsModifier;
};

export default function DeleteTeamPointsModifier({ game, team, teamPointsModifier, ...props }: Props) {
    const [show, setShow] = useState(false);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const submit = function () {
        setSubmitting(true);

        router.delete(route('dashboard.games.teams.points-modifiers.delete', {
            id: game.id,
            teamId: team.id,
            modifierId: teamPointsModifier.id,
        }), {
            onFinish: () => {
                setSubmitting(false);
            },
            onSuccess: () => {
                toast.success('Modificator verwijdered!');
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
                    <Modal.Title>Punten modificator verwijderen</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Weet je zeker dat je deze punten modifcator wilt verwijderen?</p>
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