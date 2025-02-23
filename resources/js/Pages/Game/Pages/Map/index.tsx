import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { useEffect, useLayoutEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { CircleMarker, MapContainer, Marker, Polygon, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { IonContent, IonFabButton, IonHeader, IonItem, IonText, IonTitle, IonToolbar, useIonToast } from "@ionic/react";

import { GameStatePlaying } from "@/types/game";

interface GeolocationPosition {
    lat: number
    lng: number
};

function StartLocationMarker({ location }: { location: GeolocationPosition }) {
    const icon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    return (
        <Marker position={[location.lat, location.lng]} icon={icon}>
            <Popup>
                Start locatie
            </Popup>
        </Marker>
    );
};

function UserLocationMarker({ location }: { location: GeolocationPosition }) {
    const map = useMapEvents({});
    const [position, setPosition] = useState<GeolocationPosition>({
        lat: location.lat,
        lng: location.lng
    });

    useEffect(() => {
        setPosition({
            lat: location.lat,
            lng: location.lng
        });
    }, [location])

    useEffect(() => {
        map.flyTo([location.lat, location.lng]);
    }, [])

    const flyToSelf = function () {
        map.flyTo([location.lat, location.lng]);
    }

    return position === null ? null : (
        <>
            <CircleMarker
                center={position}
                pathOptions={{
                    fillColor: '#2563eb',
                    fillOpacity: 1,
                    opacity: 1,
                    weight: 5,
                    color: '#ffffff',
                }}
                radius={10}
                className='pulse'
            />

            <div className='leaflet-bottom leaflet-left'>
                <div className="leaflet-control">
                    <IonFabButton size='small' color='medium' onClick={flyToSelf}>
                        <FontAwesomeIcon size='lg' icon={faLocationArrow} />
                    </IonFabButton>
                </div>
            </div>
        </>
    );
}

export default function Overview({ gameState }: { gameState: GameStatePlaying }) {
    const [presentToast] = useIonToast();
    const [renderMap, setRenderMap] = useState(false);
    const [locationStatus, setLocationStatus] = useState<'accessed' | 'denied' | 'error' | null>(null);
    const [position, setPosition] = useState<GeolocationPosition | null>(null);

    useLayoutEffect(() => {
        setTimeout(() => setRenderMap(true), 10);
    }, []);

    useEffect(() => {
        let watchId: number | null = null

        if ('geolocation' in navigator) {
            watchId = navigator.geolocation.watchPosition((position) => {
                setPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setLocationStatus('accessed');
            }, (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationStatus('denied');
                        presentToast({
                            message: 'Je hebt geen toegang tot je locatie gegeven. De kaart zal gelimiteerde functionaliteit hebben.',
                            duration: 5000,
                            position: 'bottom',
                            color: 'danger',
                        });
                        break
                    case error.POSITION_UNAVAILABLE:
                        setLocationStatus(null);
                        break
                    case error.TIMEOUT:
                        setLocationStatus('error');
                        presentToast({
                            message: 'Mislukt om je locatie te vinden!',
                            duration: 5000,
                            position: 'bottom',
                            color: 'danger',
                        });
                        break
                    default:
                        setLocationStatus('error');
                        presentToast({
                            message: 'Mislukt om je locatie te vinden!',
                            duration: 5000,
                            position: 'bottom',
                            color: 'danger',
                        });
                        break
                }
            });

            return () => {
                if (watchId) {
                    navigator.geolocation.clearWatch(watchId);
                }
            }
        }
    }, []);

    let mapAreaPositions: LatLngExpression[] = [];
    gameState.game.game_map_area_points.forEach((gameMapAreaPoint) => {
        mapAreaPositions.push({
            lat: gameMapAreaPoint.lat,
            lng: gameMapAreaPoint.lng,
        })
    });

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Kaart</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {(locationStatus == 'accessed') ?
                    renderMap &&
                    <div style={{ width: '100%', height: '100%' }}>
                        <MapContainer style={{ width: '100%', height: '100%' }} center={[gameState.game.start_lat ?? 0, gameState.game.start_lng ?? 0]} zoom={13} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <Polygon pathOptions={{ color: 'purple', fillOpacity: 0.1 }} positions={mapAreaPositions} />
                            {(gameState.game.start_lat && gameState.game.start_lng) && <StartLocationMarker location={{ lat: gameState.game.start_lat, lng: gameState.game.start_lng }} />}
                            {(position && locationStatus == 'accessed') && <UserLocationMarker location={position} />}
                        </MapContainer>
                    </div>
                    :
                    <IonItem>
                        <IonText>
                            <p>
                                {(locationStatus == null) && 'Sta je locatie toegang toe om de kaart te gebruiken.'}
                            </p>
                        </IonText>
                    </IonItem>
                }
            </IonContent>
        </>
    );
};
