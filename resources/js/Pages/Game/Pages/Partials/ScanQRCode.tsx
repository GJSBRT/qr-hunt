import { GameStatePlaying } from "@/types/game";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { router } from "@inertiajs/react";
import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonModal, IonText, IonTitle, IonToolbar, useIonLoading, useIonToast } from "@ionic/react";
import axios from "axios";
import jsQR from "jsqr";
import { useState } from "react";
import QRSpinningImg from '../../../../../assets/qr-spinning.gif';

interface Props {
    gameState: GameStatePlaying;
};

export default function ScanQRCode({ }: Props) {
    const [presentToast] = useIonToast();
    const [presentLoading, dismissLoading] = useIonLoading();
    const [data, setData] = useState<any | null>(null);

    const takePhoto = async () => {
        const image = await Camera.getPhoto({
            resultType: CameraResultType.Base64, // Can also use Base64 or URI
            source: CameraSource.Camera, // Can also use Photos or Prompt
        });

        if (!image) {
            presentToast({
                message: 'Kon helaas geen foto maken. Probeer het opnieuw',
                duration: 5000,
                position: 'bottom',
                color: 'danger',
            });
            return
        };

        presentLoading({
            message: 'QR code aan het verwerken...'
        });

        const base64Response = await fetch(`data:image/jpeg;base64,${image.base64String}`);
        const blob = await base64Response.blob();
        const img = await createImageBitmap(blob);

        // Create a canvas to process the QR code
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            dismissLoading();
            presentToast({
                message: 'Fout tijdens het lezen van de QR code. Probeer het opnieuw.',
                duration: 5000,
                position: 'bottom',
                color: 'danger',
            });
            return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Extract image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log('imageData', imageData)

        // Decode the QR code using jsQR
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        console.log('code', code)

        if (!code) {
            dismissLoading();
            presentToast({
                message: 'Geen QR code gevonden. Probeer het opnieuw.',
                duration: 5000,
                position: 'bottom',
                color: 'danger',
            });
            return;
        }

        if (!code.data.includes("!!QRH!!")) {
            dismissLoading();
            presentToast({
                message: 'Dit is geen geldige QR code.',
                duration: 5000,
                position: 'bottom',
                color: 'danger',
            });
            return;
        }

        let data = code.data.split('!!QRH!!', 2)[1]; // Remove start marker
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
                            <IonButton strong={true} onClick={() => {setData(null); router.reload()}}>
                                Sluiten
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

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
                                Gefeliciflapstaart, je hebt een nieuwe QR code gevonden!
                            </p>
                        </IonText>

                        <IonButton>
                            Bekijk QR code
                        </IonButton>
                    </div>
                </IonContent>
            </IonModal>
        </>
    );
};
