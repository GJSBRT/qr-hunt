import { GameMap, GameMapAreaActionElementProps } from "@/Class/GameMode/map";
import { router } from "@inertiajs/react";
import { IonButton, useIonLoading, useIonToast } from "@ionic/react";
import axios from "axios";
import { useState } from "react";
import { TerritoryKothArea } from "./types/koth";

export class TerritoryMap extends GameMap {
    constructor() {
        super();

        this.areaActions = [
            {
                type: "in_zone",
                element: ({area, gameState}: {area: TerritoryKothArea} & Omit<GameMapAreaActionElementProps, 'area'>) => {
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

                        axios.post(route('game.gamemode.action', 'claim_koth'), {
                            areaId: area.id
                        }, {})
                            .finally(() => {
                                dismissLoading();
                                setSubmitting(false);
                            })
                            .then(() => {
                                router.reload();

                                present({
                                    message: 'Je hebt dit punt geclaimed!',
                                    duration: 5000,
                                    position: 'bottom',
                                    color: 'success',
                                });
                            })
                            .catch((err) => {
                                console.error(err);
                                if (typeof err == 'string') {
                                    present({
                                        message: err,
                                        duration: 5000,
                                        position: 'bottom',
                                        color: 'danger',
                                    });
                                } else if ('response' in (err as any) && (err as any).response.data?.message) {
                                    present({
                                        message: (err as any).response.data?.message,
                                        duration: 5000,
                                        position: 'bottom',
                                        color: 'danger',
                                    });
                                } else {
                                    present({
                                        message: 'Er is een onbekende fout opgetreden. Probeer het nogmaals.',
                                        duration: 5000,
                                        position: 'bottom',
                                        color: 'danger',
                                    });
                                }
                            })
                    }

                    if (area.metadata.claimed_by_team && area.metadata.claimed_by_team.claim_team_id == gameState.teamData.team.id) {
                        return (
                            <IonButton disabled>
                                Jouw team heeft dit punt geclaimed
                            </IonButton>
                        );
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
