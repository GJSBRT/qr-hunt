import { Head } from "@inertiajs/react";
import { IonApp } from '@ionic/react';
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

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    title:          string;
    description?:   string;
}

export default function GameLayout({ title, description, children, ...props }: Props) {
    defineCustomElements(window);

    return (
        <>
            <Head title={title} />
            <IonApp>
                <div {...props}>
                    {children}
                </div>
            </IonApp>
        </>
    );
}