import PullToRefresh from "@/Components/IonicComponents/PullToRefresh";
import IonicAppLayout from "@/Layouts/IonicAppLayout";
import { PaginatedData } from "@/types";
import { Game } from "@/types/game";
import { router } from "@inertiajs/react";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react";

interface Props {
    games: PaginatedData<Game>;
}

export default function GameMaster({games, ...props}: Props) {
    return (
        <IonicAppLayout title="Selecteer een spel">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Selecteer een spel</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <PullToRefresh/>

                <IonSearchbar debounce={1000} animated={true} placeholder="Zoeken" onIonInput={(e) => {
                    router.reload({
                        data: { search: e.target.value }
                    });
                }}></IonSearchbar>

                <IonList>
                    {games.data.map((game) => (
                        <IonItem key={game.id} button onClick={() => router.visit(route('game-master.game.view', game.id))}>
                            <IonLabel>{game.name}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonicAppLayout>
    );
};
