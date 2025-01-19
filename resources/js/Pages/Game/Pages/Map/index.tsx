import { GameStatePlaying } from "@/types/game";
import { GoogleMap } from "@capacitor/google-maps";
import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useRef } from "react";

export default function Overview({ gameState }: { gameState: GameStatePlaying }) {
    const mapRef = useRef<HTMLElement>();
    let newMap: GoogleMap;

    useEffect(() => {
        if (!mapRef.current) return;

        GoogleMap.create({
            id: 'my-cool-map',
            element: mapRef.current,
            // TODO: Fix api key
            apiKey: '',
            config: {
                center: {
                    lat: 33.6,
                    lng: -117.9
                },
                zoom: 8
            }
        }).then((map) => {
            newMap = map;
        });
    })

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Kaart</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <capacitor-google-map
                    ref={mapRef}
                    style={{
                        display: 'inline-block',
                        width: '100%',
                        height: '100%'
                    }}
                ></capacitor-google-map>
            </IonContent>
        </>
    );
};
