import { Key, useCallback } from "react";
import { Select, SelectProps } from "@heroui/select";
import { FieldHelperProps, useField } from "formik";


interface DropdownFieldProps<T extends object, TKey extends (number | string)> extends SelectProps<T> {
    name: string;
    onSelectNewValue?: (newValue: TKey, fieldHelper: FieldHelperProps<TKey>) => void;
    isNumberKey?:  boolean;
}

export default function DropdownField<T extends object, TKey extends (number | string)>({
    name,
    onSelectNewValue,
    isNumberKey,
    ...restProps
}: DropdownFieldProps<T, TKey>) {
    const [fieldProps, meta, fieldHelper] = useField<number | string>(name);

    const onSelectionChange = useCallback(async (newValue: (Set<Key> | 'all')) => {
        const value: (string | number) = isNumberKey
            ? +(newValue as Set<number>).values().next().value
            : (newValue as Set<string>).values().next().value;

        await fieldHelper.setValue(value);
        fieldHelper.setTouched(true);

        onSelectNewValue?.(value as TKey, fieldHelper as FieldHelperProps<TKey>);
    }, [fieldHelper, isNumberKey, onSelectNewValue]);

    const isInvalid = !!meta.error && meta.touched;

    return (
        <Select
            {...restProps}
            {...fieldProps}
            isInvalid={isInvalid}
            errorMessage={meta.error}
            selectedKeys={fieldProps.value ? [fieldProps.value] : []}
            onSelectionChange={onSelectionChange}
            classNames={{
                helperWrapper: !isInvalid ? 'p-0' : undefined,
                trigger: restProps.isDisabled ? 'bg-gray-100' : undefined,
                value: 'text-foreground-700 font-bold',
                description: 'text-foreground-800 text-sm'
            }}
        />
    );
}
