import 'leaflet/dist/leaflet.css';
import { IonTab, IonTabBar, IonTabButton, IonTabs, useIonToast } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMap, faTrophy, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import IonicAppLayout from "@/Layouts/IonicAppLayout";
import Overview from "./Overview";
import { GameMasterProps } from "@/types/game_master";
import Teams from "./Teams";
import Score from "./Score";
import GameModes from "@/GameModes/gamemodes";
import Map from "./Map";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { SocketContext } from "@/Layouts/GameLayout";
import { PusherPrivateChannel } from 'laravel-echo/dist/channel';

export default function View(props: GameMasterProps) {
    const urlParams = new URLSearchParams(window.location.search);
    const toast = useIonToast();
    const [echo, setEcho] = useState<Echo<"pusher"> | null>(null);
    const [page, setPage] = useState<string>(urlParams.get('page') ?? 'overview');
    const [echoChannels, setEchoChannels] = useState<{ [key: string]: PusherPrivateChannel }>({});

    const changePage = function (e: CustomEvent<{
        tab: string;
    }>) {
        setPage(e.detail.tab);
        urlParams.set('page', e.detail.tab);

        const path = window.location.href.split('?')[0];
        const newURL = `${path}?${urlParams}`;

        window.history.pushState({ path: newURL }, '', newURL);
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
        if (props.game.status !== 'started') return; // Check if we're playing

        const gameMode = GameModes[props.game.game_mode];
        if (!gameMode) return;
        if (!gameMode.events) return;

        const gameModeEvents = new (gameMode.events)(toast, () => {});

        let subscribedChannels: string[] = [];
        gameModeEvents.events.forEach((gameEvent) => {
            const channelName = gameEvent.channel(props.game, null);
            if (!channelName) return;

            let channel: PusherPrivateChannel | null = null;
            if (echoChannels[channelName]) {
                channel = echoChannels[channelName];
            } else {
                channel = echo.private(channelName);
                setEchoChannels({ ...echoChannels, [channelName]: channel });
            }

            channel.listen(".App\\Class\\GameModes\\" + gameMode.label + "\\Events\\" + gameEvent.name, (data: any) => gameEvent.action(null, ...Object.values(data)));
            subscribedChannels.push(channelName);
        });

        return () => {
            subscribedChannels.forEach((channel) => {
                if (channel == `game.${props.game.id}`) return;
                echo.leave(channel);
            });
        };
    }, [echo, props.game]);

    const gameMode = GameModes[props.game.game_mode];
    if (!gameMode) return <></>;
    if (!gameMode.game_master) return <></>;

    const gameModeGameMaster = new (gameMode.game_master)();

    return (
        <IonicAppLayout title={props.game.name}>
            <SocketContext.Provider value={echo}>
                <IonTabs>
                    <IonTab tab="overview">
                        {page == 'overview' && <Overview {...props} />}
                        {page == 'teams' && <Teams {...props} />}
                        {page == 'score' && <Score {...props} />}
                        {(page == 'map' && props.gameMode.gameMap) && <Map {...props} />}
                        {gameModeGameMaster.pages.map(({ name, element: Element }) => (page === name) && <Element {...props} />)}
                    </IonTab>

                    <IonTabBar translucent slot="bottom" selectedTab={page} onIonTabsWillChange={changePage}>
                        <IonTabButton tab="overview" selected={page == 'overview'}>
                            <FontAwesomeIcon size='xl' icon={faHome} />
                            Overzicht
                        </IonTabButton>

                        <IonTabButton tab="teams" selected={page == 'teams'}>
                            <FontAwesomeIcon size='xl' icon={faUsers} />
                            Teams
                        </IonTabButton>

                        <IonTabButton tab="score" selected={page == 'score'}>
                            <FontAwesomeIcon size='xl' icon={faTrophy} />
                            Score
                        </IonTabButton>

                        {(props.gameMode.gameMap) && (
                            <IonTabButton tab="map" selected={page == 'map'}>
                                <FontAwesomeIcon size='xl' icon={faMap} />
                                Map
                            </IonTabButton>
                        )}

                        {gameModeGameMaster.pages.map(({ name, label, icon }) => (
                            <IonTabButton tab={name} selected={page == name}>
                                <FontAwesomeIcon size='xl' icon={icon} />
                                {label}
                            </IonTabButton>
                        ))}
                    </IonTabBar>
                </IonTabs>
            </SocketContext.Provider>
        </IonicAppLayout>
    );
};
