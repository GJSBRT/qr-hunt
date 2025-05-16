import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { Circle, CircleMarker, MapContainer, Marker, Polygon, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { IonContent, IonFabButton, IonHeader, IonTitle, IonToolbar } from "@ionic/react";

import GameModes from '@/GameModes/gamemodes';
import { SocketContext } from '@/Layouts/GameLayout';
import { Team, TeamPlayer } from '@/types/team';
import { StringToColor } from '@/Utils/color';
import { GameMasterProps } from '@/types/game_master';

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

function UserLocationMarker({ location, color, name }: { location: GeolocationPosition, color: string, name?: string }) {
    return (
        <>
            <CircleMarker
                center={location}
                pathOptions={{
                    fillColor: color,
                    fillOpacity: 1,
                    opacity: 1,
                    weight: 5,
                    color: '#ffffff',
                }}
                radius={10}
                className='pulse'
            >
                {(name) && (
                    <Popup>
                        {name}
                    </Popup>
                )}
            </CircleMarker>
        </>
    );
}

interface PlayerLocationEvent {
    team: Team;
    teamPlayer: TeamPlayer;
    position: GeolocationPosition;
}

export default function Map({ game, gameMode }: GameMasterProps) {
    const [renderMap, setRenderMap] = useState(false);
    const [playerLocations, setPlayerLocations] = useState<{ [key: number]: PlayerLocationEvent }>({});
    const echo = useContext(SocketContext);

    if (!gameMode.gameMap) return <></>;

    useLayoutEffect(() => {
        setTimeout(() => setRenderMap(true), 1);
    }, []);

    useEffect(() => {
        if (!echo) return;
        if (!gameMode.gameMap?.shareLocationDataToServer) return;

        echo.private(`game.${game.id}`)
            .listenForWhisper('player_location', (e: PlayerLocationEvent) => {
                setPlayerLocations({
                    ...playerLocations,
                    [e.teamPlayer.id]: e
                });
            });
    }, [echo, playerLocations]);

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Kaart</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                {(renderMap) &&
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <MapContainer style={{ width: '100%', height: '100%' }} center={gameMode.gameMap.startLocationMarker ?? undefined} zoom={15} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {gameMode.gameMap.areas.map((area) => {
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

                            {(gameMode.gameMap.startLocationMarker) && <StartLocationMarker location={gameMode.gameMap.startLocationMarker} />}
                            {(Object.values(playerLocations).map(playerLocation => (
                                <UserLocationMarker name={playerLocation.teamPlayer.name} color={StringToColor(playerLocation.team.name)} location={playerLocation.position} />
                            )))}
                        </MapContainer>
                    </div>
                }
            </IonContent>
        </>
    );
};
