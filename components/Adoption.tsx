'use client'
import { useEffect, useState } from "react";
import { Title, AreaChart, Button, BarChart } from '@tremor/react';
import PackageFullModel from '@/models/package-full-model';
import abbreviate from 'number-abbreviate'
import { DownloadsDateSelector } from './DownloadsDateSelector';
import convert from "@/utils/convert";
import npm from "@/utils/npm";
import { ITimeRange } from "@/models/npm/ITimeRange";
import axios from "axios";
import dayjs from "dayjs";
import DownloadsFullModel from "@/models/downloads-full-model";

export default function Adoption(data: Pick<PackageFullModel, 'adoption'>) {
    const { starsCount, forksCount, watchers, openIssues, downloads } = data.adoption
    const [dateQuery, setDateQuery] = useState<ITimeRange>(convert.parseDatesToQuery([dayjs().subtract(7, 'd').toDate(), new Date(), null]))
    const [point, setPoint] = useState<number>(0)
    const [range, setRange] = useState<{ downloads: number; day: string }[]>(data.adoption.downloads.range)
    const [perVersion, setPerVersion] = useState<Pick<DownloadsFullModel, 'perVersion'>>(data.adoption.downloads)

    function getDates(dates: ITimeRange) {
        setDateQuery(dates)
    }

    async function getDownloadsData() {
        const { data } = await axios.get(`http://localhost:3000/API/v1/downloads?dates=${dateQuery}&package=express`)
        // setPoint(data.point)
        setRange(data.range)
        // setPerVersion(data.perVersion)
    }

    function dataFormatter(number: number) {
        return abbreviate(number, 2)
    }

    useEffect(() => {
        getDownloadsData()
    }, [dateQuery])

    return (
        <div className="flex flex-row gap-x-6 w-auto">
            <div className="grow">
                <DownloadsDateSelector passDates={getDates}></DownloadsDateSelector>
                <AreaChart
                    // className="w-auto"
                    data={range}
                    index="day"
                    categories={["downloads"]}
                    colors={["blue"]}
                    yAxisWidth={60}
                    curveType='natural'
                    valueFormatter={dataFormatter}
                />
            </div>
            <div className="grow">
                <div className='flex justify-center gap-x-2'>
                    <Button variant='secondary' color='gray'>stars: {abbreviate(starsCount, 1)}</Button>
                    {/* <Button variant='secondary' color='gray'>watchers: {abbreviate(watchers, 1)}</Button> */}
                    <Button variant='secondary' color='gray'>forks: {abbreviate(forksCount, 1)}</Button>
                    <Button variant='secondary' color='gray'>open issues: {abbreviate(openIssues, 1)}</Button>
                </div>
                <BarChart
                    // className="w-auto"
                    data={perVersion.perVersion.slice(0, 5)}
                    categories={['downloads']}
                    index={"name"}
                    colors={["blue"]}
                    showGridLines={true}
                    yAxisWidth={60}
                    valueFormatter={dataFormatter}
                />
            </div>
        </div>
    )
}