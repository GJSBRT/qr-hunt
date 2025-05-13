import { Game } from "@/types/game";
import { IonTab, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faHome, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import IonicAppLayout from "@/Layouts/IonicAppLayout";
import Overview from "./Overview";

export default function View({ game }: { game: Game }) {
    const urlParams = new URLSearchParams(window.location.search);
    const [page, setPage] = useState<string>(urlParams.get('page') ?? 'overview');

    const changePage = function(e: CustomEvent<{
        tab: string;
    }>) {
        setPage(e.detail.tab);
        urlParams.set('page', e.detail.tab);

        const path = window.location.href.split('?')[0];
        const newURL = `${path}?${urlParams}`;

        window.history.pushState({ path: newURL }, '', newURL);
    }

    return (
        <IonicAppLayout title={game.name}>
            <IonTabs>
                <IonTab tab="overview">
                    {page == 'overview' && <Overview game={game} />}
                    {/* {page == 'map' && <Map gameState={gameState} />}
                    {page == 'powers' && <Powers gameState={gameState} />} */}
                </IonTab>

                <IonTabBar translucent slot="bottom" selectedTab={page} onIonTabsWillChange={changePage}>
                    <IonTabButton tab="overview" selected={page == 'overview'}>
                        <FontAwesomeIcon size='xl' icon={faHome} />
                        Overzicht
                    </IonTabButton>

                    <IonTabButton tab="overview" selected={page == 'overview'}>
                        <FontAwesomeIcon size='xl' icon={faUsers} />
                        Teams
                    </IonTabButton>

                    <IonTabButton tab="overview" selected={page == 'overview'}>
                        <FontAwesomeIcon size='xl' icon={faBolt} />
                        Powers
                    </IonTabButton>

                    {/* {(gameState.gameMode.gameMap != null) && (
                        <IonTabButton tab="map" selected={page == 'map'}>
                            <FontAwesomeIcon size='xl' icon={faMap} />
                            Kaart
                        </IonTabButton>
                    )}

                    {(gameState.teamData.gamePowers != null) && (
                        <IonTabButton tab="powers" selected={page == 'powers'}>
                            <FontAwesomeIcon size='xl' icon={faBolt} />
                            Powers
                        </IonTabButton>
                    )} */}
                </IonTabBar>
            </IonTabs>
        </IonicAppLayout>
    );
};
