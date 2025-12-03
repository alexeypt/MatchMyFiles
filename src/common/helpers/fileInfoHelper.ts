export function getFormattedSize(size: number) {
    if (size === 0) {
        return '0.00 B';
    }

    const e = Math.floor(Math.log(size) / Math.log(1024));

    return (size / Math.pow(1024, e)).toFixed(2)
        + ' ' + ' KMGTP'.charAt(e) + 'B';
}
