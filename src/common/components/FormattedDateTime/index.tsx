import { useEffect, useState } from 'react';

interface FormattedDateTimeProps {
    dateTime: Date;
}

function formatDateUsingDefaultFormatter(date: Date) {
    // alternatively it's possible to use such package like date-fns but as that's just a single case it doesn't make big sense to install this package
    const yyyy = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    // const hour = date.getHours();
    // const minutes = date.getMinutes();

    const MM = month < 10
        ? `0${month}`
        : month.toString();
    const dd = day < 10
        ? `0${day}`
        : day.toString();

    const formattedDate = `${dd}.${MM}.${yyyy}`;

    return formattedDate;
}

export default function FormattedDateTime({ dateTime }: FormattedDateTimeProps) {
    const [formattedDateTime, setFormattedDateTime] = useState(formatDateUsingDefaultFormatter(dateTime));

    useEffect(() => {
        // server-side rendering doesn't know anything about user's locale so it should be regenerated on client side
        const formattedDate = new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(dateTime);

        const formattedTime = new Intl.DateTimeFormat(undefined, {
            hour: '2-digit',
            minute: '2-digit'
        }).format(dateTime);

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormattedDateTime(`${formattedDate} ${formattedTime}`);
    }, [dateTime]);

    return formattedDateTime;
}
