export function getFormattedStringWithWordBreaks(str: string) {
    let result = str;

    if (result) {
        result = result.replaceAll('/', '/<wbr />');
        result = result.replaceAll('\\', '\\<wbr />');
    }

    return result;
}

function escapeRegex(str: string) {
    return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function getMarkupWithHighlights(text: string, searchQuery: string, highlightedClassName: string) {
    if (!searchQuery) {
        return text;
    }

    const highlightedMatch = RegExp(escapeRegex(searchQuery), 'gi');

    return text.replace(highlightedMatch, $0 => `<span class="${highlightedClassName}">${$0}</span>`);
}
