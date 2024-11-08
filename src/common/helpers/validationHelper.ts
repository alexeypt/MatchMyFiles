import * as Yup from 'yup';


export function isRequired<T extends { [k: string]: any; }>(validationSchema: Yup.ObjectSchema<T>, fieldName: string) {
    const field = Yup.getIn(validationSchema, fieldName);

    if (!field) {
        return false;
    }

    return !(field.schema.describe() as Yup.SchemaDescription).optional;
}
