import { IonTab, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTrophy, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import IonicAppLayout from "@/Layouts/IonicAppLayout";
import Overview from "./Overview";
import { GameMasterProps } from "@/types/game_master";
import Teams from "./Teams";
import Score from "./Score";
import GameModes from "@/GameModes/gamemodes";

export default function View(props: GameMasterProps) {
    const urlParams = new URLSearchParams(window.location.search);
    const [page, setPage] = useState<string>(urlParams.get('page') ?? 'overview');

    const changePage = function (e: CustomEvent<{
        tab: string;
    }>) {
        setPage(e.detail.tab);
        urlParams.set('page', e.detail.tab);

        const path = window.location.href.split('?')[0];
        const newURL = `${path}?${urlParams}`;

        window.history.pushState({ path: newURL }, '', newURL);
    }

    const gameMode = GameModes[props.game.game_mode];
    if (!gameMode) return <></>;
    if (!gameMode.game_master) return <></>;

    const gameModeGameMaster = new (gameMode.game_master)();

    return (
        <IonicAppLayout title={props.game.name}>
            <IonTabs>
                <IonTab tab="overview">
                    {page == 'overview' && <Overview {...props} />}
                    {page == 'teams' && <Teams {...props} />}
                    {page == 'score' && <Score {...props} />}
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

                    {gameModeGameMaster.pages.map(({ name, label, icon }) => (
                        <IonTabButton tab={name} selected={page == name}>
                            <FontAwesomeIcon size='xl' icon={icon} />
                            {label}
                        </IonTabButton>
                    ))}
                </IonTabBar>
            </IonTabs>
        </IonicAppLayout>
    );
};
