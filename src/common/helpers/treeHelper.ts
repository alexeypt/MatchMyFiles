export function getTreeKey(key: number, prefix?: string) {
    return prefix
        ? `${prefix}-${key}`
        : key.toString();
}
