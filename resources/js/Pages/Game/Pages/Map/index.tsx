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
import { LocationContext } from '@/Layouts/GameLayout';
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

function UserLocationMarker({ location, color, self }: { location: GeolocationPosition, color: string, self?: boolean }) {
    const map = useMapEvents({});

    useEffect(() => {
        if (self !== true) return;
        map.flyTo([location.lat, location.lng]);
    }, [])

    const flyToSelf = function () {
        map.flyTo([location.lat, location.lng], 17);
    }

    return (
        <>
            <CircleMarker
                center={location}
                pathOptions={{
                    fillColor: color,
                    fillOpacity: 1,
                    opacity: 1,
                    weight: 5,
                    color: (self === true) ? '#2563eb' : '#ffffff',
                }}
                radius={10}
                className='pulse'
            />

            {(self) && (
                <div className='leaflet-bottom leaflet-left'>
                    <div className="leaflet-control">
                        <IonFabButton size='small' color='medium' onClick={flyToSelf}>
                            <FontAwesomeIcon size='lg' icon={faLocationArrow} />
                        </IonFabButton>
                    </div>
                </div>
            )}
        </>
    );
}

export default function Map({ gameState }: { gameState: GameStatePlaying }) {
    const [presentToast] = useIonToast();
    const [renderMap, setRenderMap] = useState(false);
    const location = useContext(LocationContext);
    const [actionElements, setActionElements] = useState<{
        id: string;
        element: (...args: any) => JSX.Element
        props: { [key: string]: any }
    }[]>([]);

    if (!gameState.gameMode.gameMap) return <></>;

    const gameMode = GameModes[gameState.gameMode.gameMode];
    if (!gameMode) return <></>;
    if (!gameMode.map) return <></>;

    const gameModeMap = new (gameMode.map)();

    if (!location) return <></>;

    useLayoutEffect(() => {
        setTimeout(() => setRenderMap(true), 1);
    }, []);

    useEffect(() => {
        if (location.position === null) return;

        const position = location.position as GeolocationPosition;

        let showElements: {
            id: string;
            element: (...args: any) => JSX.Element
            props: { [key: string]: any }
        }[] = [];

        gameState.gameMode.gameMap?.areas.forEach((area) => {
            let isWithinArea = false;

            switch (area.type) {
                case 'polygon':
                    isWithinArea = IsPointInPolygon([position.lat, position.lng], area.geoLocations.map((v) => [v.lat, v.lng]));
                    break;
                case 'circle':
                    let distance = HaversineDistance([position.lng, position.lat], [area.geoLocations[0].lng, area.geoLocations[0].lat])
                    isWithinArea = (distance <= area.radius);
                    break;
            }

            if (!isWithinArea) return;

            gameModeMap.areaActions.forEach((areaAction) => {
                if (areaAction.type !== 'in_zone') return;
                showElements.push({
                    id: area.id,
                    element: areaAction.element,
                    props: {
                        area: area,
                        gameState: gameState
                    }
                });
            });
        });

        let currentIds = actionElements.map((item) => item.id).sort();
        let newIds = showElements.map((item) => item.id).sort();

        if (currentIds.length !== newIds.length) {
            setActionElements(showElements);
            return;
        }

        if (currentIds.every((value, index) => value === newIds[index])) {
            return;
        }

        setActionElements(showElements);
    }, [location.position])

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Kaart</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {(location.locationStatus == 'accessed') ?
                    renderMap &&
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <div style={{ position: 'absolute', zIndex: 99999, display: 'flex', flexDirection: 'column', justifyContent: 'end', alignItems: 'center', bottom: 5, left: 50, right: 50 }}>
                            {actionElements.map(({ element: Element, props }) => <Element {...props} />)}
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
                                                <Polygon key={'polygon' + area.id} pathOptions={{ color: area.color, fillOpacity: area.opacity }} positions={area.geoLocations} />
                                                <Marker icon={L.divIcon({ html: area.name, className: 'marker-text' })} key={'marker' + area.id} position={[area.geoLocations.map((v) => v.lat).reduce((a, b) => (a + b)) / area.geoLocations.length, area.geoLocations.map((v) => v.lng).reduce((a, b) => (a + b)) / area.geoLocations.length]} />
                                            </>
                                        );
                                    case 'circle':
                                        return <Circle key={'circle' + area.id} pathOptions={{ color: area.color, fillOpacity: area.opacity }} center={area.geoLocations[0]} radius={area.radius} />;
                                }
                            })}

                            {(gameState.gameMode.gameMap.startLocationMarker) && <StartLocationMarker location={gameState.gameMode.gameMap.startLocationMarker} />}
                            {(location.position && location.locationStatus == 'accessed') && <UserLocationMarker color={StringToColor(gameState.teamData.team.name)} self location={location.position} />}
                            {gameState.gameMode.gameMap.teamIdsWhichCanViewOthersLocations.includes(gameState.teamPlayer.team_id) && (Object.values(location.playerLocations).map(playerLocation => (
                                <UserLocationMarker color={StringToColor(playerLocation.team.name)} location={playerLocation.position} />
                            )))}
                        </MapContainer>
                    </div>
                    :
                    <IonItem>
                        <IonText>
                            <p>
                                {(location.locationStatus == null) && 'Sta je locatie toegang toe om de kaart te gebruiken.'}
                                {!('geolocation' in navigator) && 'Je browser ondersteunt geolocatie niet.'}
                            </p>
                        </IonText>
                    </IonItem>
                }
            </IonContent>
        </>
    );
};
