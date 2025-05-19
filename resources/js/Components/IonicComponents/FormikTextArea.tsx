import { IonTextarea } from "@ionic/react";
import { FormikProps, getIn } from "formik";

type Props = {
    form: FormikProps<any>;
    name: string;
    label?: string;
    type: string;
    placeholder?: string;
} & React.ComponentProps<typeof IonTextarea>

export default function FormikTextArea({ name, form, ...props }: Props) {
    const inValid = getIn(form.touched, name) && getIn(form.errors, name) !== undefined;

    return (
        <IonTextarea
            labelPlacement="stacked"
            className={`${inValid === true && 'ion-invalid'} ${form.touched[name] && 'ion-touched'}`}
            onIonChange={(e) => {
                form.setFieldValue(name, e.detail.value);
            }}
            value={form.values[name]}
            errorText={getIn(form.errors, name)}
            {...props}
        />
    )
}