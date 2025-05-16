import { Camera, CameraResultType } from "@capacitor/camera";
import { IonButton, IonImg } from "@ionic/react";
import { FormikProps } from "formik";

type Props = {
    form: FormikProps<any>;
    name: string;
}

export default function FormikImage({ name, form }: Props) {
    const takePicture = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Base64
        });

        form.setFieldValue(name, image.base64String)
    };

    return (
        <div style={{marginLeft: 16, marginRight: 16 }}>
            <IonButton style={{marginBottom: 8}} expand="block" size='small' onClick={takePicture}>Selecteer of neem een foto</IonButton>

            <IonImg
                src={form.values[name]}
                alt='Taken photo'
            />
        </div>
    )
}