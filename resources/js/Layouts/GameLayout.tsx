import { Head, router } from "@inertiajs/react";
import { IonApp, useIonToast } from '@ionic/react';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

import '../../css/game.css';
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import { createContext, useEffect, useState } from "react";
import Echo from "laravel-echo";
import { GameState } from "@/types/game";
import { GameStartedEvent, LobbyUpdatedEvent, TeamQRCodeTransferredEvent } from "@/types/events";
import Pusher from "pusher-js";
import GameOverScreen from "./Partials/GameOverScreen";
import PowerActivatedScreen from "./Partials/PowerActivatedScreen";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    gameState: GameState;
}

export const SocketContext = createContext<Echo<"pusher"> | null>(null);

export default function GameLayout({ title, description, children, gameState, ...props }: Props) {
    defineCustomElements(window);
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

        gameChannel.listen('TeamQRCodeTransferredEvent', (e: TeamQRCodeTransferredEvent) => {
            if (!gameState.team || !route().current('game.lobby.*')) return;

            presentToast({
                message: (e.from_team_id == gameState.team.id) ? 'Jouw team heeft een QR code weggegeven.' : 'Je team heeft een QR code ontvangen!',
                duration: 5000,
                position: 'bottom',
                color: (e.from_team_id == gameState.team.id) ? 'warning' : 'success',
            });

            router.reload();
        });

        return () => {
            echo.leave(`game.${gameState.game.id}`);
        };
    }, [echo])

    return (
        <>
            <Head title={title} />
            <IonApp>
                <SocketContext.Provider value={echo}>
                    <GameOverScreen game={gameState.game} />
                    {gameState.team && <PowerActivatedScreen team={gameState.team} />}

                    <div {...props}>
                        {children}
                    </div>
                </SocketContext.Provider>
            </IonApp>
        </>
    );
}