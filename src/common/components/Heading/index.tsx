import { createElement, HTMLAttributes } from 'react';


interface HeadingProps extends HTMLAttributes<HTMLHeadingElement>{
    level: number
}

function Heading({ level, ...restProps }: HeadingProps) {
    const headingReactElement = createElement(`h${Math.min(level, 6)}`, restProps);

    return headingReactElement;
}

export default Heading;
