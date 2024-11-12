export function pluralize(count: number, singleName: string, pluralName?: string) {
    if (count === 1) {
        return `${count} ${singleName}`;
    }

    return pluralName
        ? `${count} ${pluralName}`
        : `${count} ${singleName}s`;
}

export function pluralizeText(count: number, singleName: string, pluralName?: string) {
    if (count === 1) {
        return singleName;
    }

    return pluralName
        ? pluralName
        : `${singleName}s`;
}
