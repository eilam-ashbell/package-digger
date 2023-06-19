'use client'
import { useEffect, useState } from "react";
import { DateRangePicker, DateRangePickerValue } from "@tremor/react";
import { enUS } from "date-fns/locale";
import convert from "@/utils/convert";
import dayjs from "dayjs";

export function DownloadsDateSelector({ passDates }) {
    const minNpmDataDate = new Date(2015, 0, 11)
    const [dates, setDates] = useState<DateRangePickerValue>([dayjs().subtract(7, 'd').toDate(), new Date(), null]);

    useEffect(() => {
        const dateQuery = convert.parseDatesToQuery(dates)
        passDates(dateQuery)
    }, [dates])

    return (
        <DateRangePicker
            className="mx-auto my-2"
            value={dates}
            onValueChange={setDates}
            locale={enUS}
            dropdownPlaceholder="Select"
            enableYearPagination={true}
            minDate={minNpmDataDate}
            options={[
                { value: 'tw', text: 'This week', startDate: dayjs().startOf('w').toDate() },
                { value: 'tm', text: dayjs().format('MMMM'), startDate: dayjs().startOf('M').toDate() },
                { value: 'ty', text: dayjs().format('YYYY'), startDate: dayjs().startOf('y').toDate() },
                { value: 'l7d', text: 'Last 7 days', startDate: dayjs().subtract(7, 'd').toDate() },
                { value: 'l30d', text: 'Last 30 days', startDate: dayjs().subtract(30, 'd').toDate() },
                { value: 'ly', text: 'Last year', startDate: dayjs().subtract(1, 'y').toDate() },
            ]}
            maxDate={dayjs().subtract(1, 'd').toDate()}
        />
    );
}