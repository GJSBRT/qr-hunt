import { IonTab, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTrophy, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import IonicAppLayout from "@/Layouts/IonicAppLayout";
import Overview from "./Overview";
import { GameMasterProps } from "@/types/game_master";
import Teams from "./Teams";
import Score from "./Score";

export default function View(props: GameMasterProps) {
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
        <IonicAppLayout title={props.game.name}>
            <IonTabs>
                <IonTab tab="overview">
                    {page == 'overview' && <Overview {...props} />}
                    {page == 'teams' && <Teams {...props} />}
                    {page == 'score' && <Score {...props} />}
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
                </IonTabBar>
            </IonTabs>
        </IonicAppLayout>
    );
};
