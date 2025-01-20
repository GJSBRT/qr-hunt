import axios from "axios";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CapacitorBarcodeScannerCameraDirection, CapacitorBarcodeScannerScanOrientation, CapacitorBarcodeScannerTypeHint } from "@capacitor/barcode-scanner";
import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonModal, IonText, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";

import { Power } from "@/types/power";
import { Quartet } from "@/types/quartet";
import { GameStatePlaying } from "@/types/game";
import { CapacitorBarcodeScannerPatchWeb } from "@/Components/IonicComponents/BarcodeScanner";

import QRSpinningImg from '../../../../../assets/qr-spinning.gif';

interface Props {
    gameState: GameStatePlaying;
};

export default function ScanQRCode({ }: Props) {
    const [presentToast] = useIonToast();
    const [presentLoading, dismissLoading] = useIonLoading();
    const [data, setData] = useState<{ quartet: Quartet; power: Power } | null>(null);

    const takePhoto = async () => {
        const result = await CapacitorBarcodeScannerPatchWeb.scanBarcode({
            hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
            cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
            scanOrientation: CapacitorBarcodeScannerScanOrientation.PORTRAIT,
            web: {
                showCameraSelection: true,
            }
        });

        presentLoading({
            message: 'QR code aan het verwerken...'
        });

        if (!result.ScanResult.includes("!!QRH!!")) {
            dismissLoading();
            presentToast({
                message: 'Dit is geen geldige QR code.',
                duration: 5000,
                position: 'bottom',
                color: 'danger',
            });
            return;
        }

        let data = result.ScanResult.split('!!QRH!!', 2)[1]; // Remove start marker
        data = atob(data);
        data = JSON.parse(data);

        axios({
            method: 'post',
            url: route('game.qr-code'),
            data: data,
        }).then((resp) => {
            setData(resp.data);
        }).catch((err) => {
            let errors = '';

            Object.values(err?.response.data.errors as { [key: string]: string }).forEach((error, index) => {
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

        }).finally(() => {
            dismissLoading();
        });
    };

    return (
        <>
            <IonFab style={{ marginBottom: '3.25rem' }} slot="fixed" vertical="bottom" horizontal="end">
                <IonFabButton onClick={takePhoto}>
                    <FontAwesomeIcon icon={faCamera} size='xl' />
                </IonFabButton>
            </IonFab>

            <IonModal isOpen={data !== null}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="end">
                            <IonButton strong={true} onClick={() => { setData(null); router.reload() }}>
                                Sluiten
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                {(data !== null) &&
                    <IonContent>
                        <div className="ion-padding" style={{ textAlign: 'center', backgroundColor: '#fcfefc', height: '100%' }}>
                            <img src={QRSpinningImg} style={{
                                marginTop: '-2rem',
                                marginBottom: '-1rem',
                                height: '343px',
                                animation: 'bounceIn 1s ease-out forwards, bounce 1s ease-in-out infinite 1s'
                            }} />

                            <IonText>
                                <h1>Nieuwe QR code!</h1>
                            </IonText>

                            <IonText>
                                <p>
                                    Gefeliciflapstaart, je hebt een nieuwe{data.quartet ? ` ${data.quartet.category_label} - ${data.quartet.value}`
                                        :
                                        data.power ? ` ${data.power.description}` : ''
                                    } QR code gevonden!
                                </p>
                            </IonText>

                            {data.quartet &&
                                <IonText>
                                    <p><b>Dus check je kwartet setjes!</b></p>
                                </IonText>
                            }
                        </div>
                    </IonContent>
                }
            </IonModal>
        </>
    );
};
