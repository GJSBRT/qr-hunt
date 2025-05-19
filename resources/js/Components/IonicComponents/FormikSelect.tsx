import { IonSelect, IonSelectOption, IonTextarea } from "@ionic/react";
import { FormikProps, getIn } from "formik";
import { ReactNode } from "react";

type Props = {
    form: FormikProps<any>;
    name: string;
    label?: string;
    items: Array<{
        value: any;
        label: string|ReactNode;
    }>;
} & React.ComponentProps<typeof IonSelect>

export default function FormikSelect({ name, form, items, ...props }: Props) {
    const inValid = getIn(form.touched, name) && getIn(form.errors, name) !== undefined;

    return (
        <IonSelect 
            value={form.values[name]}
            className={`${inValid === true && 'ion-invalid'} ${form.touched[name] && 'ion-touched'}`}
            onIonChange={(e) => {
                form.setFieldValue(name, e.detail.value);
            }}
            // @ts-expect-error
            errorText={getIn(form.errors, name)}
            {...props}
        >
            {items.map(item => <IonSelectOption key={item.value} value={item.value}>{item.label}</IonSelectOption>)}
        </IonSelect>
    )
}
