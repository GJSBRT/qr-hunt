import { GameMap, GameMapAreaActions } from "@/Class/GameMode/map";
import { router } from "@inertiajs/react";
import { IonButton, useIonLoading, useIonToast } from "@ionic/react";
import { useState } from "react";

export class TerritoryMap extends GameMap {
    constructor() {
        super();

        this.areaActions = [
            {
                type: "in_zone",
                element: (area) => {
                    if (area.gameType != 'koth') return <></>;

                    const [submitting, setSubmitting] = useState<boolean>(false);
                    const [presentLoading, dismissLoading] = useIonLoading();
                    const [present] = useIonToast();

                    const submit = function () {
                        if (submitting) return;
                        setSubmitting(true);

                        presentLoading({
                            message: 'Punt aan het claimen...'
                        });

                        router.put(route('game.gamemode.action', 'claim_koth'), {}, {
                            onFinish: () => {
                                dismissLoading();
                                setSubmitting(false);
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
                    }

                    return (
                        <>
                            <IonButton onClick={submit}>
                                Claim king of the hill {/* TODO: zoek een nederlandse naam */}
                            </IonButton>
                        </>
                    );
                }
            }
        ];
    }
}
