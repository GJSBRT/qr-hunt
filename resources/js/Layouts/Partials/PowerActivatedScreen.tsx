import { router } from "@inertiajs/react";
import { useContext, useEffect, useState } from "react";
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonText, IonTitle, IonToolbar } from "@ionic/react";

import { Team } from "@/types/team";
import { POWER_TYPE_LANGUAGE } from "@/types/power";
import { PowerActivatedEvent, } from "@/types/events";

import { SocketContext } from "../GameLayout";

interface Props {
    team: Team;
};

export default function PowerActivatedScreen({ team }: Props) {
    const echo = useContext(SocketContext);
    const [event, setEvent] = useState<PowerActivatedEvent | null>(null);

    useEffect(() => {
        if (!echo) return;

        echo.private(`team.${team.id}`).listen('PowerActivatedEvent', (e: PowerActivatedEvent) => {
            setEvent(e);
            router.reload();
        });

        return () => {
            echo.leave(`team.${team.id}`);
        };
    }, [echo])

    return (
        <>
            <IonModal isOpen={event !== null}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Power toegepast!</IonTitle>

                        <IonButtons slot="end">
                            <IonButton onClick={() => setEvent(null)}>
                                Sluiten
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                {event && (
                    <IonContent className="ion-padding">
                        <IonText>
                            <p>
                                {(event.fromTeam) ? (
                                    event.power.power_up ?
                                        `Je team heeft een power up (${event.power.description ?? POWER_TYPE_LANGUAGE[event.power.type] ?? 'Onbekende power'}) toegepast gekregen van team '${event.fromTeam.name}'! Doe ze een bedankje.`
                                    :
                                        `Oh oh, je team heeft een power down (${event.power.description ?? POWER_TYPE_LANGUAGE[event.power.type] ?? 'Onbekende power'}) toegepast gekregen van team '${event.fromTeam.name}'.`
                                ) : (
                                    event.power.power_up ?
                                        `Je team's power up (${event.power.description ?? POWER_TYPE_LANGUAGE[event.power.type] ?? 'Onbekende power'}) is toegepast! Veel plezier.`
                                    :
                                        `Je team's power down (${event.power.description ?? POWER_TYPE_LANGUAGE[event.power.type] ?? 'Onbekende power'}) is helaas toegepast. Veel plezier ;).`
                                )}
                            </p>
                        </IonText>
                    </IonContent>
                )}
            </IonModal >
        </>
    );
};
