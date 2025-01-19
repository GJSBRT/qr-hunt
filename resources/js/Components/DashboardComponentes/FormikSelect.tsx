import { FormikProps } from "formik";
import { ReactNode } from "react";
import { Form, InputGroup } from "react-bootstrap";

interface Props {
    form: FormikProps<any>;
    id?: string;
    name: string;
    label: string;
    children: ReactNode;
}

export default function FormikSelect({ form, label, children, ...props }: Props) {
    return (
        <>
            <Form.Label htmlFor={props.id ?? props.name}>{label}</Form.Label>
            <InputGroup className="mb-3">
                <Form.Select
                    id={props.id ?? props.name}
                    onChange={form.handleChange}
                    value={form.values[props.name]}
                    isValid={form.touched[props.name] && !form.errors[props.name]}
                    isInvalid={!!form.errors[props.name]}
                    {...props}
                >
                    {children}
                </Form.Select>

                <Form.Control.Feedback type="invalid">
                    {form.errors[props.name] as string}
                </Form.Control.Feedback>
            </InputGroup>
        </>
    );
};
