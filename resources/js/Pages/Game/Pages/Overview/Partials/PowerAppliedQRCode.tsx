import { router } from "@inertiajs/react";
import { IonButton, IonItem, IonText, useIonLoading, useIonToast } from "@ionic/react";

import { Game } from "@/types/game";
import { TeamQRCode } from "@/types/qr_code";
import { Power, POWER_TYPE_LANGUAGE } from "@/types/power";

interface Props {
    game: Game;
    teamQRcode: TeamQRCode & {
        power: Power;
    };
};

export default function PowerAppliedQRCode({ game, teamQRcode }: Props) {
    const [presentToast] = useIonToast();
    const [presentLoading, dismissLoading] = useIonLoading();

    const submit = function () {
        presentLoading({
            message: 'Team aan het aanmaken...'
        });

        router.put(route('game.qr-code.complete-power', {
            id: game.id,
            teamQRCodeId: teamQRcode.id,
        }), {}, {
            onFinish: () => {
                dismissLoading();
            },
            onSuccess: () => {
                router.reload();
            },
            onError: (error) => {
                let errors = '';

                Object.values(error).forEach((error, index) => {
                    errors += error;

                    if (Object.values(error).length - 1 != index) {
                        errors + '\n\n';
                    }
                });

                presentToast({
                    message: errors,
                    duration: 5000,
                    position: 'bottom',
                    color: 'danger',
                });
            },
        });
    };

    return (
        <>
            <IonItem>
                <IonText>{teamQRcode.power.description ?? POWER_TYPE_LANGUAGE[teamQRcode.power.type] ?? 'Onbekende power'}</IonText>
                <IonText slot='end'>
                    <IonButton fill='clear' onClick={submit}>
                        Voltooien
                    </IonButton>
                </IonText>
            </IonItem>
        </>
    );
};
