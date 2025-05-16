import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { Circle, CircleMarker, MapContainer, Marker, Polygon, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { IonContent, IonFabButton, IonHeader, IonItem, IonText, IonTitle, IonToolbar, useIonToast } from "@ionic/react";

import { GameStatePlaying } from "@/types/game";
import GameModes from '@/GameModes/gamemodes';
import { HaversineDistance, IsPointInPolygon } from '@/Utils/polygons';
import { SocketContext } from '@/Layouts/GameLayout';
import moment from 'moment';
import { Team, TeamPlayer } from '@/types/team';
import { StringToColor } from '@/Utils/color';

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

function UserLocationMarker({ location, color, ringColor }: { location: GeolocationPosition, color: string, ringColor?: string }) {
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
                    fillColor: color,
                    fillOpacity: 1,
                    opacity: 1,
                    weight: 5,
                    color: ringColor ?? '#ffffff',
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

const UPDATE_PLAYER_LOCATION_SECONDS = 3;

interface PlayerLocationEvent {
    team: Team;
    teamPlayer: TeamPlayer;
    position: GeolocationPosition;
}

export default function Map({ gameState }: { gameState: GameStatePlaying }) {
    const [presentToast] = useIonToast();
    const [renderMap, setRenderMap] = useState(false);
    const [locationStatus, setLocationStatus] = useState<'accessed' | 'denied' | 'error' | null>(null);
    const [position, setPosition] = useState<GeolocationPosition | null>(null);
    const [lastPositionSent, setLastPositionSent] = useState<number>(0);
    const [playerLocations, setPlayerLocations] = useState<{[key: number]: PlayerLocationEvent}>({});
    const echo = useContext(SocketContext);
    const [actionElements, setActionElements] = useState<{
        element: (...args: any) => JSX.Element
        props: {[key: string]: any}
    }[]>([]);

    if (!gameState.gameMode.gameMap) return <></>;

    const gameMode = GameModes[gameState.gameMode.gameMode];
    if (!gameMode) return <></>;
    if (!gameMode.map) return <></>;

    const gameModeMap = new (gameMode.map)();

    useLayoutEffect(() => {
        setTimeout(() => setRenderMap(true), 1);
    }, []);

    useEffect(() => {
        if (!echo) return;
        if (!position) return;
        if (!gameState.gameMode.gameMap?.shareLocationDataToServer) return;
        if ((moment().unix() - lastPositionSent) <= UPDATE_PLAYER_LOCATION_SECONDS) return;

        setLastPositionSent(moment().unix());

        echo.private(`game.${gameState.game.id}`)
            .whisper('player_location', {
                team: gameState.teamData.team,
                teamPlayer: gameState.teamPlayer,
                position: position,
            });
    }, [echo, position]);

    useEffect(() => {
        if (!echo) return;
        if (!gameState.gameMode.gameMap?.shareLocationDataToServer) return;
        if ((moment().unix() - lastPositionSent) <= UPDATE_PLAYER_LOCATION_SECONDS) return;

        setLastPositionSent(moment().unix());

        echo.private(`game.${gameState.game.id}`)
            .listenForWhisper('player_location', (e: PlayerLocationEvent) => {
                setPlayerLocations({
                    ...playerLocations,
                    [e.teamPlayer.id]: e
                });
            });
    }, [echo]);

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            return;
        }

        let watchId = navigator.geolocation.watchPosition((position) => {
            let currentLat = position.coords.latitude;
            let currentLng = position.coords.longitude;

            if (import.meta.env.DEV) {
                currentLat = parseFloat(import.meta.env.VITE_DEV_COORDS_LAT) + (Math.random() / 10000),
                currentLng = parseFloat(import.meta.env.VITE_DEV_COORDS_LONG) + (Math.random() / 10000)
            }

            setPosition({
                lat: currentLat,
                lng: currentLng
            });

            let showElements: {
                element: (...args: any) => JSX.Element
                props: {[key: string]: any}
            }[] = [];
            gameState.gameMode.gameMap?.areas.forEach((area) => {
                let isWithinArea = false;

                switch (area.type) {
                    case 'polygon':
                        isWithinArea = IsPointInPolygon([currentLat, currentLng], area.geoLocations.map((v) => [v.lat, v.lng]));
                        break;
                    case 'circle':
                        let distance = HaversineDistance([currentLng, currentLat], [area.geoLocations[0].lng, area.geoLocations[0].lat])
                        isWithinArea = (distance <= area.radius);
                        break;
                }

                if (!isWithinArea) return;

                gameModeMap.areaActions.forEach((areaAction) => {
                    if (areaAction.type !== 'in_zone') return;
                    showElements.push({
                        element: areaAction.element,
                        props: {
                            area: area,
                            gameState: gameState
                        }
                    });
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
    }, [gameState]);

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
                            {actionElements.map(({element: Element, props}) => <Element {...props}/>)}
                        </div>

                        <MapContainer style={{ width: '100%', height: '100%' }} center={gameState.gameMode.gameMap.startLocationMarker ?? undefined} zoom={15} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {gameState.gameMode.gameMap.areas.map((area) => {
                                switch (area.type) {
                                    case 'polygon':
                                        return (
                                            <>
                                                <Polygon key={'polygon'+area.id} pathOptions={{ color: area.color, fillOpacity: area.opacity }} positions={area.geoLocations} />
                                                <Marker icon={L.divIcon({html: area.name, className: 'marker-text'})} key={'marker'+area.id} position={[area.geoLocations.map((v) => v.lat).reduce((a,b) => (a + b)) / area.geoLocations.length, area.geoLocations.map((v) => v.lng).reduce((a,b) => (a + b)) / area.geoLocations.length]}/>
                                            </>
                                        );
                                    case 'circle':
                                        return <Circle key={'circle'+area.id} pathOptions={{ color: area.color, fillOpacity: area.opacity }} center={area.geoLocations[0]} radius={area.radius} />;
                                }
                            })}

                            {(gameState.gameMode.gameMap.startLocationMarker) && <StartLocationMarker location={gameState.gameMode.gameMap.startLocationMarker} />}
                            {(position && locationStatus == 'accessed') && <UserLocationMarker color={StringToColor(gameState.teamData.team.name)} ringColor='#2563eb' location={position} />}
                            {gameState.gameMode.gameMap.teamIdsWhichCanViewOthersLocations.includes(gameState.teamPlayer.team_id) && (Object.values(playerLocations).map(playerLocation => (
                                <UserLocationMarker color={StringToColor(playerLocation.team.name)} location={playerLocation.position} />
                            )))}
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
