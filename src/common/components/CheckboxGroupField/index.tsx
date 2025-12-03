import { useCallback } from 'react';
import { Checkbox, CheckboxGroup, CheckboxGroupProps } from '@heroui/checkbox';
import { useField } from 'formik';


interface CheckboxGroupFieldProps extends CheckboxGroupProps {
    name: string;
    items: {
        value: string;
        label: string;
    }[];
}

export default function CheckboxGroupField({ name, items, ...restProps }: CheckboxGroupFieldProps) {
    const [fieldProps, meta, fieldHelpers] = useField(name);

    const isInvalid = !!meta.error && meta.touched;

    const onValueChanged = useCallback((values: string[]) => {
        fieldHelpers.setValue(values, true);
    }, [fieldHelpers]);

    return (
        <CheckboxGroup
            {...restProps}
            value={fieldProps.value}
            errorMessage={meta.error}
            isInvalid={isInvalid}
            name={fieldProps.name}
            onChange={onValueChanged}
            onBlur={fieldProps.onBlur}
        >
            {
                items.map(item => (
                    <Checkbox
                        key={item.value}
                        value={item.value}
                    >
                        {item.label}
                    </Checkbox>
                ))
            }
        </CheckboxGroup>
    );
}
