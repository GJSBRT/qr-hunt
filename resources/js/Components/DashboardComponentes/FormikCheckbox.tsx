import { FormikProps } from "formik";
import { Form, InputGroup } from "react-bootstrap";

interface Props {
    form: FormikProps<any>;
    id?: string;
    name: string;
    label: string;
}

export default function FormikCheckbox({ form, ...props }: Props) {
    return (
        <>
            <InputGroup className="mb-3">
                <Form.Check
                    id={props.id ?? props.name}
                    onChange={form.handleChange}
                    checked={form.values[props.name]}
                    isValid={form.touched[props.name] && !form.errors[props.name]}
                    isInvalid={!!form.errors[props.name]}
                    {...props}
                />

                <Form.Control.Feedback type="invalid">
                    {form.errors[props.name] as string}
                </Form.Control.Feedback>
            </InputGroup>
        </>
    );
};
