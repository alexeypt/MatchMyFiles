export function generateUrl(route: string, params: { [key: string]: string | number }) {
    let result = route;

    const regex = /(:([a-z0-9]+))/g;

    let execResult: RegExpExecArray | null = null;
    while ((execResult = regex.exec(route)) !== null) {
        const paramName = execResult[2];

        if (paramName && params[paramName]) {
            result = result.replace(execResult[0], params[paramName].toString());
        }
    }

    return result;
}
