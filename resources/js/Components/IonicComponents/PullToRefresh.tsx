import { router } from "@inertiajs/react";
import { IonRefresher, IonRefresherContent, RefresherEventDetail } from "@ionic/react";

export default function PullToRefresh() {
    const handleRefresh = function (event: CustomEvent<RefresherEventDetail>) {
        router.reload({
            onFinish: () => event.detail.complete(),
        });
    };

    return (
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
    );
}
