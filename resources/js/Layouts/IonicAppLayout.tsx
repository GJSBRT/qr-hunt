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

import '@ionic/react/css/palettes/dark.system.css';

import { IonApp } from "@ionic/react";
import { ReactNode } from 'react';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Head } from '@inertiajs/react';

interface Props {
    title: string;
    children: ReactNode;
}

export default function IonicAppLayout({title, children, ...props}: Props) {
    defineCustomElements(window);

    return (
        <>
            <Head title={title}/>
            <IonApp {...props}>
                {children}
            </IonApp>
        </>
    );
}