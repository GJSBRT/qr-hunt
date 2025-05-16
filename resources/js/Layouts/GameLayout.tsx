import { router } from "@inertiajs/react";
import { IonFab, IonFabButton, IonFabList, useIonToast } from '@ionic/react';

import NotificationSound from '../../assets/notification-sound.mp3';
import '../../css/game.css';

import { createContext, useEffect, useState } from "react";
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

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    gameState: GameState;
}

export const SocketContext = createContext<Echo<"pusher"> | null>(null);

export default function GameLayout({ title, description, children, gameState, ...props }: Props) {
    const toast = useIonToast();
    const [presentToast] = useIonToast();
    const [playNotificationSound] = useSound(NotificationSound);

    const [echo, setEcho] = useState<Echo<"pusher"> | null>(null);
    const [echoChannels, setEchoChannels] = useState<{ [key: string]: PusherPrivateChannel }>({});

    const gameMode = GameModes[gameState.gameMode.gameMode];
    let gameModeFab: GameFab | null = null;
    if (gameMode && gameMode.fab) {
        gameModeFab = new (gameMode.fab)();
    }

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
            const channelName = gameEvent.channel(gameStatePlaying);

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

    return (
        <>
            <IonicAppLayout title={title}>
                <SocketContext.Provider value={echo}>
                    <GameOverScreen game={gameState.game} />
                    {/* {gameState.team && <PowerActivatedScreen team={gameState.team} />} */}

                    <div {...props}>
                        {children}
                    </div>

                    {(gameModeFab && (gameModeFab.actions.length > 0) && gameState.teamPlayer !== null && gameState.game.status === 'started') && (
                        <IonFab slot="fixed" vertical="bottom" horizontal="end" style={{bottom: '4rem'}}>
                            <IonFabButton>
                                <FontAwesomeIcon size='lg' icon={faChevronUp} />
                            </IonFabButton>

                            <IonFabList side="top">
                                {gameModeFab.actions.map(({element: Element}) => <Element gameState={gameState as GameStatePlaying} />)}
                            </IonFabList>
                        </IonFab>
                    )}
                </SocketContext.Provider>
            </IonicAppLayout>
        </>
    );
}