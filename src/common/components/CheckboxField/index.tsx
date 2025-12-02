import { Checkbox, CheckboxProps } from "@heroui/checkbox";
import { useField } from "formik";


interface CheckboxFieldProps extends CheckboxProps {
    name: string;
}

export default function CheckboxField({ name, ...restProps }: CheckboxFieldProps) {
    const [fieldProps, meta] = useField(name);

    return (
        <Checkbox
            {...restProps}
            {...fieldProps}
            isSelected={fieldProps.value}
            isInvalid={!!meta.error && meta.touched}
        />
    );
}
