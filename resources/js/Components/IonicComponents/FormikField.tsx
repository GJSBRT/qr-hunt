import { IonInput } from "@ionic/react";
import { FormikProps, getIn } from "formik";

type Props = {
    form: FormikProps<any>;
    name: string;
    label: string;
    type: string;
    placeholder?: string;
} & React.ComponentProps<typeof IonInput>

export default function FormikField({ name, form, ...props }: Props) {
    const inValid = getIn(form.touched, name) && getIn(form.errors, name) !== undefined;

    return (
        <IonInput
            className={`${inValid === true && 'ion-invalid'} ${form.touched[name] && 'ion-touched'}`}
            labelPlacement="stacked"
            onIonChange={(e) => {
                form.setFieldValue(name, e.detail.value);
            }}
            errorText={getIn(form.errors, name)}
            {...props}
        />
    )
}