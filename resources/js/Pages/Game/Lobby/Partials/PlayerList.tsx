import { Team, TeamPlayer } from "@/types/team";
import { router } from "@inertiajs/react";
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonModal, IonNote, IonRefresher, IonRefresherContent, IonText, IonTitle, IonToolbar, RefresherEventDetail } from "@ionic/react";
import { useState } from "react";

interface Props {
    teamPlayers: Array<TeamPlayer & {
        team: Team;
    }>;
};

export default function PlayerList({ teamPlayers }: Props) {
    const [showModal, setShowModal] = useState(false);

    const handleRefresh = function (event: CustomEvent<RefresherEventDetail>) {
        router.reload({
            onFinish: () => event.detail.complete(),
        });
    };

    return (
        <>
            <IonItem onClick={() => setShowModal(true)} detail>
                <IonLabel>
                    Alle spelers
                </IonLabel>
                <IonNote>{teamPlayers.length}</IonNote>
            </IonItem>

            <IonModal isOpen={showModal}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Alle spelers</IonTitle>

                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowModal(false)}>
                                Sluiten
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>

                    <IonList lines="full">
                        {teamPlayers.map(teamPlayer => (
                            <IonItem key={teamPlayer.id}>
                                <IonText>{teamPlayer.name}</IonText>
                                <IonNote slot='end'>{teamPlayer.team.name}</IonNote>
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </IonModal>
        </>
    );
};
