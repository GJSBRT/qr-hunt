import PullToRefresh from "@/Components/IonicComponents/PullToRefresh";
import { GameMasterProps } from "@/types/game_master";
import { Team, TeamPlayer } from "@/types/team";
import { router } from "@inertiajs/react";
import { IonActionSheet, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonModal, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { useState } from "react";

// Could not import
interface IonActionSheetCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLIonActionSheetElement;
}

export default function Teams({ game }: GameMasterProps) {
    const [showTeamActions, setShowTeamActions] = useState<boolean>(false);
    const [viewingTeam, setViewingTeam] = useState<Team & {
        team_players: TeamPlayer[];
    } | null>(null);
    const [viewingTeamPlayer, setViewingTeamPlayer] = useState<TeamPlayer | null>(null);
    const [presentLoading, dismissLoading] = useIonLoading();
    const [present] = useIonToast();

    function teamActionDismiss(e: IonActionSheetCustomEvent<OverlayEventDetail>) {
        if (!viewingTeam) {
            setViewingTeam(null);
            setShowTeamActions(false);
            return;
        }

        if (e.detail.role == 'backdrop') {
            setShowTeamActions(false);
            return;
        }

        presentLoading({
            message: 'Team aan het verwijderen...'
        });

        switch (e.detail.data['action']) {
            case 'delete':
                router.delete(route('game-master.game.teams.delete', {
                    id: game.id,
                    teamId: viewingTeam?.id,
                }), {
                    onFinish: () => {
                        setShowTeamActions(false);
                        dismissLoading();
                    },
                    onSuccess: () => {
                        router.reload();
                    },
                    onError: (error) => {
                        let errors = '';

                        Object.values(error).forEach((error, index) => {
                            errors += error;

                            if (Object.values(error).length - 1 != index) {
                                errors + '\n\n';
                            }
                        });

                        present({
                            message: errors,
                            duration: 5000,
                            position: 'bottom',
                            color: 'danger',
                        });
                    },
                });
                return;
        }
    }

    function teamPlayerActionDismiss(e: IonActionSheetCustomEvent<OverlayEventDetail>) {
        if (!viewingTeam) {
            setViewingTeam(null);
            setShowTeamActions(false);
            setViewingTeamPlayer(null);
            return;
        }

        if (!viewingTeamPlayer) {
            setViewingTeamPlayer(null);
            return;
        }

        if (e.detail.role == 'backdrop') {
            setViewingTeamPlayer(null);
            return;
        }

        presentLoading({
            message: 'Speler aan het verwijderen...'
        });

        switch (e.detail.data['action']) {
            case 'delete':
                router.delete(route('game-master.game.teams.players.delete', {
                    id: game.id,
                    teamId: viewingTeam.id,
                    playerId: viewingTeamPlayer.id
                }), {
                    onFinish: () => {
                        setShowTeamActions(false);
                        dismissLoading();
                    },
                    onSuccess: () => {
                        router.reload();
                    },
                    onError: (error) => {
                        let errors = '';

                        Object.values(error).forEach((error, index) => {
                            errors += error;

                            if (Object.values(error).length - 1 != index) {
                                errors + '\n\n';
                            }
                        });

                        present({
                            message: errors,
                            duration: 5000,
                            position: 'bottom',
                            color: 'danger',
                        });
                    },
                });
                return;
        }
    }

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Teams</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <PullToRefresh />

                <IonList lines='full'>
                    {(game.teams.length == 0) && (
                        <IonItem>
                            Geen teams in dit spel.
                        </IonItem>
                    )}

                    {game.teams.map((team) => (
                        <IonItem key={team.id} onClick={() => setViewingTeam(team)} detail>
                            <IonLabel>{team.name}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>

                <IonModal isOpen={viewingTeam !== null}>
                    {(viewingTeam) && (
                        <>
                            <IonHeader>
                                <IonToolbar>
                                    <IonButtons slot="start">
                                        <IonButton strong onClick={() => setShowTeamActions(true)}>
                                            Acties
                                        </IonButton>
                                    </IonButtons>

                                    <IonTitle>{viewingTeam.name}</IonTitle>

                                    <IonButtons slot="end">
                                        <IonButton onClick={() => setViewingTeam(null)}>
                                            Sluiten
                                        </IonButton>
                                    </IonButtons>
                                </IonToolbar>
                            </IonHeader>

                            <IonContent>
                                <PullToRefresh />

                                <IonList lines="full">
                                    {(viewingTeam.team_players.length == 0) && (
                                        <IonItem>
                                            Geen spelers in dit team.
                                        </IonItem>
                                    )}

                                    {viewingTeam.team_players.map((player) => (
                                        <IonItem key={player.id} onClick={() => setViewingTeamPlayer(player)} detail>
                                            <IonLabel>{player.name}</IonLabel>
                                        </IonItem>
                                    ))}
                                </IonList>
                            </IonContent>
                        </>
                    )}
                </IonModal>

                <IonActionSheet
                    isOpen={showTeamActions}
                    header="Actions"
                    buttons={[
                        {
                            text: 'Verwijder team',
                            role: 'destructive',
                            data: {
                                action: 'delete',
                            },
                        },
                    ]}
                    onDidDismiss={teamActionDismiss}
                ></IonActionSheet>

                <IonActionSheet
                    isOpen={viewingTeamPlayer !== null}
                    header={viewingTeamPlayer ? viewingTeamPlayer.name : ''}
                    buttons={[
                        {
                            text: 'Verwijder speler',
                            role: 'destructive',
                            data: {
                                action: 'delete',
                            },
                        },
                    ]}
                    onDidDismiss={teamPlayerActionDismiss}
                ></IonActionSheet>
            </IonContent>
        </>
    );
};
