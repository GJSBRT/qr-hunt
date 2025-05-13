import { router } from "@inertiajs/react";
import { useIonToast } from '@ionic/react';

import '../../css/game.css';

import { createContext, useEffect, useState } from "react";
import Echo from "laravel-echo";
import { GameState } from "@/types/game";
import { GameStartedEvent, LobbyUpdatedEvent } from "@/types/events";
import Pusher from "pusher-js";
import GameOverScreen from "./Partials/GameOverScreen";
import PowerActivatedScreen from "./Partials/PowerActivatedScreen";
import IonicAppLayout from "./IonicAppLayout";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    gameState: GameState;
}

export const SocketContext = createContext<Echo<"pusher"> | null>(null);

export default function GameLayout({ title, description, children, gameState, ...props }: Props) {
    const [presentToast] = useIonToast();

    const [echo, setEcho] = useState<Echo<"pusher"> | null>(null);

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

        const gameChannel = echo.private(`game.${gameState.game.id}`);
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
    }, [echo])

    return (
        <>
            <IonicAppLayout title={title}>
                <SocketContext.Provider value={echo}>
                    <GameOverScreen game={gameState.game} />
                    {gameState.team && <PowerActivatedScreen team={gameState.team} />}

                    <div {...props}>
                        {children}
                    </div>
                </SocketContext.Provider>
            </IonicAppLayout>
        </>
    );
}