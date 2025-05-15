import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { Circle, CircleMarker, MapContainer, Marker, Polygon, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { IonContent, IonFabButton, IonHeader, IonItem, IonText, IonTitle, IonToolbar, useIonToast } from "@ionic/react";

import { GameStatePlaying } from "@/types/game";
import GameModes from '@/GameModes/gamemodes';
import { HaversineDistance, IsPointInPolygon } from '@/Utils/polygons';

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

export default function Map({ gameState }: { gameState: GameStatePlaying }) {
    const [presentToast] = useIonToast();
    const [renderMap, setRenderMap] = useState(false);
    const [locationStatus, setLocationStatus] = useState<'accessed' | 'denied' | 'error' | null>(null);
    const [position, setPosition] = useState<GeolocationPosition | null>(null);
    const [actionElements, setActionElements] = useState<ReactNode[]>([]);

    if (!gameState.gameMode.gameMap) return <></>;

    const gameMode = GameModes[gameState.gameMode.gameMode];
    if (!gameMode) return <></>;
    if (!gameMode.map) return <></>;

    const gameModeMap = new (gameMode.map)();

    useLayoutEffect(() => {
        setTimeout(() => setRenderMap(true), 1);
    }, []);

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            return;
        }

        let watchId = navigator.geolocation.watchPosition((position) => {
            let currentLat = position.coords.latitude;
            let currentLng = position.coords.longitude;

            if (import.meta.env.DEV) {
                currentLat = import.meta.env.VITE_DEV_COORDS_LAT,
                currentLng = import.meta.env.VITE_DEV_COORDS_LONG
            }

            setPosition({
                lat: currentLat,
                lng: currentLng
            });

            let showElements: ReactNode[] = [];
            gameState.gameMode.gameMap?.areas.forEach((area) => {
                let isWithinArea = false;

                switch (area.type) {
                    case 'polygon':
                        isWithinArea = IsPointInPolygon([currentLng, currentLat], area.geoLocations.map((v) => [v.lat, v.lng]));
                        break;
                    case 'circle':
                        let distance = HaversineDistance([currentLng, currentLat], [area.geoLocations[0].lng, area.geoLocations[0].lat])
                        isWithinArea = (distance <= area.radius);
                        break;
                }

                if (!isWithinArea) return;

                gameModeMap.areaActions.forEach((areaAction) => {
                    if (areaAction.type !== 'in_zone') return;
                    let Element = areaAction.element
                    //@ts-ignore
                    showElements.push(<Element area={area} gameState={gameState} />);
                });
            });

            setActionElements(showElements);


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
    }, []);

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
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <div style={{ position: 'absolute', zIndex: 99999, display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: 'center', bottom: 5, left: 50, right: 50 }}>
                            {actionElements.map((element) => <>{element}</>)}
                        </div>

                        <MapContainer style={{ width: '100%', height: '100%' }} center={gameState.gameMode.gameMap.startLocationMarker ?? undefined} zoom={13} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {gameState.gameMode.gameMap.areas.map((area) => {
                                switch (area.type) {
                                    case 'polygon':
                                        return <Polygon pathOptions={{ color: area.color, fillOpacity: area.opacity }} positions={area.geoLocations} />;
                                    case 'circle':
                                        return <Circle pathOptions={{ color: area.color, fillOpacity: area.opacity }} center={area.geoLocations[0]} radius={area.radius} />;
                                }
                            })}

                            {(gameState.gameMode.gameMap.startLocationMarker) && <StartLocationMarker location={gameState.gameMode.gameMap.startLocationMarker} />}
                            {(position && locationStatus == 'accessed') && <UserLocationMarker location={position} />}
                        </MapContainer>
                    </div>
                    :
                    <IonItem>
                        <IonText>
                            <p>
                                {(locationStatus == null) && 'Sta je locatie toegang toe om de kaart te gebruiken.'}
                                {!('geolocation' in navigator) && 'Je browser ondersteunt geolocatie niet.'}
                            </p>
                        </IonText>
                    </IonItem>
                }
            </IonContent>
        </>
    );
};
