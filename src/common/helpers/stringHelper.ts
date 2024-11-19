export function getFormattedStringWithWordBreaks(str: string) {
    let result = str;
    if (result) {
        result = result.replaceAll('/', '/<wbr />');
        result = result.replaceAll('\\', '\\<wbr />');
    }
    
    return result;
}
