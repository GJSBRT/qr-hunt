import { router } from "@inertiajs/react";
import { IonFab, IonFabButton, IonFabList, useIonToast } from '@ionic/react';

import NotificationSound from '../../assets/notification-sound.mp3';
import 'leaflet/dist/leaflet.css';
import '../../css/game.css';

import { createContext, useEffect, useMemo, useState } from "react";
import Echo from "laravel-echo";
import { GameState, GameStatePlaying } from "@/types/game";
import { GameStartedEvent, LobbyUpdatedEvent } from "@/types/events";
import Pusher from "pusher-js";
import GameOverScreen from "./Partials/GameOverScreen";
import IonicAppLayout from "./IonicAppLayout";
import GameModes from "@/GameModes/gamemodes";
import { PusherPrivateChannel } from "laravel-echo/dist/channel";
import { GameFab } from "@/Class/GameMode/fab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import useSound from "use-sound";
import { Team, TeamPlayer } from "@/types/team";
import moment from "moment";
import { GameFabAction } from '@/Class/GameMode/fab';

const UPDATE_PLAYER_LOCATION_SECONDS = 3;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    gameState: GameState;
}

interface PlayerLocationEvent {
    team: Team;
    teamPlayer: TeamPlayer;
    position: GeolocationPosition;
}

interface GeolocationPosition {
    lat: number
    lng: number
};

interface LocationContextData {
    position: GeolocationPosition | null;
    setPosition: (position: GeolocationPosition) => void;
    playerLocations: { [key: number]: PlayerLocationEvent };
    setPlayerLocations: (playerLocations: { [key: number]: PlayerLocationEvent }) => void;
    locationStatus: LocationStatus | null;
    setLocationStatus: (locationStatus: LocationStatus | null) => void;
}

type LocationStatus = 'accessed' | 'denied' | 'error';

export const SocketContext = createContext<Echo<"pusher"> | null>(null);
export const LocationContext = createContext<LocationContextData | null>(null);

function GameModeFab({ gameState }: { gameState: GameState }) {
    const gameMode = GameModes[gameState.gameMode.gameMode];
    let gameModeFab: GameFab | null = null;
    if (gameMode && gameMode.fab) {
        gameModeFab = new (gameMode.fab)();
    }

    if (((!gameModeFab) || (gameModeFab.actions.length == 0))) return <></>;
    if ((gameState.teamPlayer === null) || (gameState.game.status !== 'started')) return <></>;

    const actions = useMemo<GameFabAction[]>(() => {
        return gameModeFab.actions;
    }, [])

    return (
        <IonFab slot="fixed" vertical="bottom" horizontal="end" style={{ bottom: '4rem' }}>
            <IonFabButton>
                <FontAwesomeIcon size='lg' icon={faChevronUp} />
            </IonFabButton>

            <IonFabList side="top" style={{zIndex: 9999}}>
                {actions.map(({ element: Element }, index) => <Element key={index} gameState={gameState as GameStatePlaying} />)}
            </IonFabList>
        </IonFab>
    )
}

export default function GameLayout({ title, description, children, gameState, ...props }: Props) {
    const toast = useIonToast();
    const [presentToast] = useIonToast();
    const [playNotificationSound] = useSound(NotificationSound, {
        volume: 1,
        interrupt: true,
    });

    const [lastPositionSent, setLastPositionSent] = useState<number>(0);
    const [position, setPosition] = useState<GeolocationPosition | null>(null);
    const [locationStatus, setLocationStatus] = useState<LocationStatus | null>(null);
    const [playerLocations, setPlayerLocations] = useState<{ [key: number]: PlayerLocationEvent }>({});

    const [echo, setEcho] = useState<Echo<"pusher"> | null>(null);
    const [echoChannels, setEchoChannels] = useState<{ [key: string]: PusherPrivateChannel }>({});

    useEffect(() => {
        if (!window.Pusher) {
            window.Pusher = Pusher;
        }

        if (!window.Echo) {
            const secure = import.meta.env.VITE_PUSHER_SCHEME == 'https';

            const e = new Echo({
                broadcaster: 'pusher',
                key: import.meta.env.VITE_PUSHER_APP_KEY,
                cluster: 'ws',
                wsHost: import.meta.env.VITE_PUSHER_HOST,
                wsPort: import.meta.env.VITE_PUSHER_PORT,
                wssPort: import.meta.env.VITE_PUSHER_PORT,
                forceTLS: secure,
                encrypted: true,
                enabledTransports: ['ws', 'wss'],
            });

            window.Echo = e;

            setEcho(e);
        } else {
            setEcho(window.Echo);
        }
    }, []);

    useEffect(() => {
        if (!echo) return;

        const channelName = `game.${gameState.game.id}`;
        let gameChannel: PusherPrivateChannel | null = null;
        if (echoChannels[channelName]) {
            gameChannel = echoChannels[channelName];
        } else {
            gameChannel = echo.private(channelName);
            setEchoChannels({ ...echoChannels, [channelName]: gameChannel });
        }

        gameChannel.listen('GameStartedEvent', (e: GameStartedEvent) => {
            router.visit(route('game.index'));

            presentToast({
                message: 'Het spel is gestart!',
                duration: 5000,
                position: 'bottom',
                color: 'success',
            });
        });

        gameChannel.listen('LobbyUpdatedEvent', (e: LobbyUpdatedEvent) => {
            if (!route().current('game.lobby.*')) return;
            router.reload();
        });

        return () => {
            echo.leave(`game.${gameState.game.id}`);
        };
    }, [echo]);

    useEffect(() => {
        if (!echo) return;
        if (gameState.teamPlayer === null || gameState.game.status !== 'started') return; // Check if we're playing

        const gameMode = GameModes[gameState.gameMode.gameMode];
        if (!gameMode) return;
        if (!gameMode.events) return;
        const gameModeEvents = new (gameMode.events)(toast, playNotificationSound);

        // We can semi-confidently change the type.
        let gameStatePlaying: GameStatePlaying = gameState as GameStatePlaying;

        let subscribedChannels: string[] = [];
        gameModeEvents.events.forEach((gameEvent) => {
            const channelName = gameEvent.channel(gameStatePlaying.game, gameStatePlaying.teamData.team);
            if (!channelName) return;

            let channel: PusherPrivateChannel | null = null;
            if (echoChannels[channelName]) {
                channel = echoChannels[channelName];
            } else {
                channel = echo.private(channelName);
                setEchoChannels({ ...echoChannels, [channelName]: channel });
            }

            channel.listen(".App\\Class\\GameModes\\" + gameMode.label + "\\Events\\" + gameEvent.name, (data: any) => gameEvent.action(gameStatePlaying, ...Object.values(data)));
            subscribedChannels.push(channelName);
        });

        return () => {
            subscribedChannels.forEach((channel) => {
                if (channel == `game.${gameState.game.id}`) return;
                echo.leave(channel);
            });
        };
    }, [echo, gameState]);

    useEffect(() => {
        if (!echo) return;
        if (!position) return;
        if (gameState.teamPlayer === null || gameState.game.status !== 'started') return; // Check if we're playing
        if (!gameState.gameMode.gameMap?.shareLocationDataToServer) return;
        if ((moment().unix() - lastPositionSent) <= UPDATE_PLAYER_LOCATION_SECONDS) return;

        setLastPositionSent(moment().unix());

        // We can semi-confidently change the type.
        let gameStatePlaying: GameStatePlaying = gameState as GameStatePlaying;

        echo.private(`game.${gameState.game.id}`)
            .whisper('player_location', {
                team: gameStatePlaying.teamData.team,
                teamPlayer: gameState.teamPlayer,
                position: position,
            });
    }, [echo, position]);

    useEffect(() => {
        if (!echo) return;
        if (gameState.teamPlayer === null || gameState.game.status !== 'started') return; // Check if we're playing
        if (!gameState.gameMode.gameMap?.shareLocationDataToServer) return;

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

            setLocationStatus('accessed');
        }, (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    setLocationStatus('denied');
                    presentToast({
                        message: 'Je hebt geen toegang tot je locatie gegeven. Je spel ervaring zal gelimiteerd zijn.',
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
            <IonicAppLayout title={title}>
                <SocketContext.Provider value={echo}>
                    <LocationContext.Provider value={{
                        position: position,
                        setPosition: setPosition,
                        playerLocations: playerLocations,
                        setPlayerLocations: setPlayerLocations,
                        locationStatus: locationStatus,
                        setLocationStatus: setLocationStatus
                    }}>
                        <GameOverScreen game={gameState.game} />
                        {/* {gameState.team && <PowerActivatedScreen team={gameState.team} />} */}

                        <div {...props}>
                            {children}
                        </div>
                    </LocationContext.Provider>

                    <GameModeFab gameState={gameState} />
                </SocketContext.Provider>
            </IonicAppLayout>
        </>
    );
}