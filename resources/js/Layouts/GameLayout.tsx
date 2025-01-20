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
import { Game } from "@/types/game";
import { GameStartedEvent, TeamWonEvent } from "@/types/events";
import Pusher from "pusher-js";
import GameOverScreen from "./Partials/GameOverScreen";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description?: string;
    game: Game;
}

export const SocketContext = createContext<Echo<"pusher"> | null>(null);

export default function GameLayout({ title, description, children, game, ...props }: Props) {
    defineCustomElements(window);
    const [presentToast] = useIonToast();

    const [echo, setEcho] = useState<Echo<"pusher"> | null>(null);

    useEffect(() => {
        //@ts-ignore
        if (!window.Pusher) {
            //@ts-ignore
            window.Pusher = Pusher;
        }

        // @ts-ignore
        if (!window.Echo) {
            const secure = import.meta.env.VITE_PUSHER_SCHEME == 'https';

            const e = new Echo({
                broadcaster: 'pusher',
                key: import.meta.env.VITE_PUSHER_APP_KEY,
                cluster: 'ws',
                wsHost: import.meta.env.VITE_PUSHER_HOST,
                wsPort: !secure ? import.meta.env.VITE_PUSHER_PORT : undefined,
                wssPort: secure ? import.meta.env.VITE_PUSHER_PORT : undefined,
                forceTLS: secure,
                encrypted: secure,
                enabledTransports: secure ? ['wss'] : ['ws'],
            });

            // @ts-ignore
            window.Echo = e;

            setEcho(e);

            const gameChannel = e.private(`game.${game.id}`);
            gameChannel.listen('GameStartedEvent', (e: GameStartedEvent) => {
                router.visit(route('game.index'));

                presentToast({
                    message: 'Het spel is gestart!',
                    duration: 5000,
                    position: 'bottom',
                    color: 'success',
                });
            });
        } else {
            //@ts-ignore
            setEcho(window.Echo);
        }

        return () => {
            //@ts-ignore
            window.Echo.leave(`game.${game.id}`);
        };
    }, []);

    return (
        <>
            <Head title={title} />
            <IonApp>
                <SocketContext.Provider value={echo}>
                    <GameOverScreen game={game} />

                    <div {...props}>
                        {children}
                    </div>
                </SocketContext.Provider>
            </IonApp>
        </>
    );
}