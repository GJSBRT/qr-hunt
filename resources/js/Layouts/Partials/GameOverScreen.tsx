import ReactConfetti from "react-confetti";
import { router } from "@inertiajs/react";
import { useContext, useEffect, useState } from "react";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonList, IonModal, IonText, IonTitle, IonToolbar } from "@ionic/react";

import { Game } from "@/types/game";
import { TeamWonEvent } from "@/types/events";

import { SocketContext } from "../GameLayout";
import FinishFlagImg from '../../../assets/finish-flag.gif';

interface Props {
    game: Game;
};

export default function GameOverScreen({ game }: Props) {
    const [teamWonEvent, setTeamWonEvent] = useState<TeamWonEvent | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showConfetti, setShowConfetti] = useState<boolean>(false);

    const echo = useContext(SocketContext);

    useEffect(() => {
        if (!echo) return;

        echo.private(`game.${game.id}`).listen('TeamWonEvent', (e: TeamWonEvent) => {
            setTeamWonEvent(e);

            setShowConfetti(true);
            setShowModal(true);
            setTimeout(() => setShowConfetti(false), 15000)
        });

        return () => {
            echo.leave(`game.${game.id}`);
        };
    }, [echo])

    return (
        <>
            <IonModal isOpen={showModal}>
                {showConfetti && <ReactConfetti numberOfPieces={150}/>}

                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Game over</IonTitle>

                        <IonButtons slot="end">
                            <IonButton onClick={() => router.visit(route('welcome'))}>
                                Spel sluiten
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                {(game.show_results && teamWonEvent && teamWonEvent != null) ?
                    <IonContent>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${teamWonEvent.teamScores.length >= 3 ? 3 : teamWonEvent.teamScores.length}, minmax(0, 1fr))`,
                            marginTop: '1rem',
                            paddingLeft: '0.5rem',
                            paddingRight: '0.5rem',
                        }}>
                            {(teamWonEvent.teamScores.length >= 2) &&
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textAlign: 'center',
                                    gap: '1rem',
                                    paddingTop: '3rem'
                                }}>
                                    <IonText style={{
                                        fontSize: '1.25rem',
                                    }}>
                                        {teamWonEvent.teamScores[1].team.name}
                                    </IonText>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem',
                                        padding: '1rem',
                                        backgroundColor: '#d6d6d630',
                                        borderRadius: '0.5rem 0.5rem 0rem 0.5rem',
                                        height: '100%'
                                    }}>
                                        <FontAwesomeIcon color='#d6d6d6' size='3x' icon={faMedal} />
                                        <IonText style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{teamWonEvent.teamScores[1].score} Punten</IonText>
                                        <IonText>2e van de {teamWonEvent.teamScores.length}</IonText>
                                    </div>
                                </div>
                            }
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'center',
                                gap: '1rem',
                            }}>
                                <IonText style={{
                                    fontSize: '1.25rem',
                                }}>
                                    {teamWonEvent.teamScores[0].team.name}
                                </IonText>

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem',
                                    padding: '1rem',
                                    backgroundColor: '#FCB43440',
                                    borderRadius: '0.5rem 0.5rem 0rem 0rem',
                                    height: '100%',
                                    boxShadow: '0 0px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                                }}>
                                    <FontAwesomeIcon color='#FCB434' size='3x' icon={faMedal} />
                                    <IonText style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{teamWonEvent.teamScores[0].score} Punten</IonText>
                                    <IonText>1e van de {teamWonEvent.teamScores.length}</IonText>
                                </div>
                            </div>
                            {(teamWonEvent.teamScores.length >= 3) &&
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textAlign: 'center',
                                    gap: '1rem',
                                    paddingTop: '5rem'
                                }}>
                                    <IonText style={{
                                        fontSize: '1.25rem',
                                    }}>
                                        {teamWonEvent.teamScores[2].team.name}
                                    </IonText>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem',
                                        padding: '1rem',
                                        backgroundColor: '#f5a23b30',
                                        borderRadius: '0.5rem 0.5rem 0.5rem 0rem',
                                        height: '100%'
                                    }}>
                                        <FontAwesomeIcon color='#f5a23b' size='3x' icon={faMedal} />
                                        <IonText style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{teamWonEvent.teamScores[2].score} Punten</IonText>
                                        <IonText>3e van de {teamWonEvent.teamScores.length}</IonText>
                                    </div>
                                </div>
                            }
                        </div>

                        <IonList lines="full">
                            {teamWonEvent.teamScores.map((result, index) => (
                                (![0, 1, 2].includes(index)) &&
                                <IonItem key={result.team.id}>
                                    <IonText>{result.team.name}</IonText>
                                    <IonText slot='end'>{result.score} punten</IonText>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonContent>
                    :
                    <IonContent className="ion-padding">
                        <IonText>
                            <p>Het spel is afgelopen! Keer terug naar de start locatie voor de uitslag van de game master.</p>
                        </IonText>

                        <div>
                            <img src={FinishFlagImg} />
                        </div>
                    </IonContent>
                }
            </IonModal>
        </>
    );
};
