import { IonInput, IonItem, IonList, IonRadio, IonRadioGroup } from "@ionic/react";
import { FormikProps, getIn } from "formik";
import { ReactNode } from "react";

type Props = {
    form: FormikProps<any>;
    name: string;
    placeholder?: string;
    items: {
        value: any;
        label: string | ReactNode;
    }[];
} & React.ComponentProps<typeof IonRadioGroup>

export default function FormikRadio({ name, form, items, ...props }: Props) {
    const inValid = getIn(form.touched, name) && getIn(form.errors, name) !== undefined;

    return (
        <IonList lines="full">
            <IonRadioGroup
                className={`${inValid === true && 'ion-invalid'} ${form.touched[name] && 'ion-touched'}`}
                onIonChange={(e) => {
                    form.setFieldValue(name, e.detail.value);
                }}
                //@ts-ignore
                errorText={getIn(form.errors, name)}
                {...props}
            >
                {items.map((item) => (
                    <IonItem key={item.value}>
                        <IonRadio value={item.value}>
                            {item.label}
                        </IonRadio>
                    </IonItem>
                ))}
            </IonRadioGroup>
        </IonList>
    )
}