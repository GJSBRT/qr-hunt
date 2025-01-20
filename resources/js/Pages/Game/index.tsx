import { GameStatePlaying } from "@/types/game";
import { IonTab, IonTabBar, IonTabButton, IonTabs } from "@ionic/react";
import Overview from "./Pages/Overview";
import Map from "./Pages/Map";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMap, faQrcode, faShapes } from "@fortawesome/free-solid-svg-icons";
import GameLayout from "@/Layouts/GameLayout";
import ScanQRCode from "./Pages/Partials/ScanQRCode";
import QRCodes from "./Pages/QRCodes";
import { useState } from "react";
import Quartet from "./Pages/Quartet";

export default function Game({ gameState }: { gameState: GameStatePlaying }) {
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
        <GameLayout title="Spel" gameState={gameState}>
            <ScanQRCode gameState={gameState}/>

            <IonTabs>
                <IonTab tab="overview">
                    {page == 'overview' && <Overview gameState={gameState} />}
                    {page == 'map' && <Map gameState={gameState} />}
                    {page == 'qrcodes' && <QRCodes gameState={gameState}/>}
                    {page == 'quartet' && <Quartet gameState={gameState} />}
                </IonTab>

                <IonTabBar translucent slot="bottom" selectedTab={page} onIonTabsWillChange={changePage}>
                    <IonTabButton tab="overview" selected={page == 'overview'}>
                        <FontAwesomeIcon size='xl' icon={faHome} />
                        Overzicht
                    </IonTabButton>

                    <IonTabButton tab="map" selected={page == 'map'}>
                        <FontAwesomeIcon size='xl' icon={faMap} />
                        Kaart
                    </IonTabButton>

                    <IonTabButton tab="qrcodes" selected={page == 'qrcodes'}>
                        <FontAwesomeIcon size='xl' icon={faQrcode} />
                        QR Codes
                    </IonTabButton>

                    <IonTabButton tab="quartet" selected={page == 'quartet'}>
                        <FontAwesomeIcon size='xl' icon={faShapes} />
                        Kwartet
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        </GameLayout>
    );
};
