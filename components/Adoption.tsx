'use client';
import { useEffect, useState } from 'react';
import {
    Title,
    AreaChart,
    Button,
    BarChart,
    Tab,
    TabList,
} from '@tremor/react';
import PackageFullModel from '@/models/package-full-model';
import abbreviate from 'number-abbreviate';
import { DownloadsDateSelector } from './DownloadsDateSelector';
import convert from '@/utils/convert';
import npm from '@/utils/npm';
import { ITimeRange } from '@/models/npm/ITimeRange';
import axios from 'axios';
import dayjs from 'dayjs';
import DownloadsFullModel from '@/models/downloads-full-model';
import KeyDataBar from './KeyDataBar';
import SectionTitle from './SectionTitle';
import { useParams } from 'next/navigation';

export default function Adoption(data: Pick<PackageFullModel, 'adoption'>) {
    const params = useParams();
    const packageName = params.packageName;
    const { starsCount, forksCount, watchers, openIssues, downloads } =
        data.adoption;
    const [dateQuery, setDateQuery] = useState<ITimeRange>(
        convert.parseDatesToQuery([
            dayjs().subtract(7, 'd').toDate(),
            new Date(),
            null,
        ]),
    );
    const [point, setPoint] = useState<number>(0);
    const [range, setRange] = useState<{ downloads: number; day: string }[]>();
    const [perVersion, setPerVersion] =
        useState<Pick<DownloadsFullModel, 'perVersion'>>(downloads);
    const [tabNumber, setTabNumber] = useState('1');

    function getDates(dates: ITimeRange) {
        setDateQuery(dates);
    }

    async function getDownloadsData() {
        const { data } = await axios.get(
            `http://localhost:3000/API/v1/package/${packageName}/downloads?dates=${dateQuery}&package=express`,
        );
        // setPoint(data.point)
        setRange(data.range);
        // setPerVersion(data.perVersion)
    }

    function dataFormatter(number: number) {
        return abbreviate(number, 2);
    }

    useEffect(() => {
        getDownloadsData();
    }, [dateQuery]);

    const KeyDataBarData = [
        { title: 'stars', value: abbreviate(starsCount, 1) },
        { title: 'forks', value: abbreviate(forksCount, 1) },
        { title: 'open issues', value: abbreviate(openIssues, 1) },
    ];

    return (
        <div>
            <SectionTitle title='Adoption' />
            <div className='my-2'>
                <KeyDataBar data={KeyDataBarData} />
            </div>
            <TabList
                value={tabNumber}
                onValueChange={(value) => setTabNumber(value)}
            >
                <Tab
                    value='1'
                    text={`over time`}
                />
                <Tab
                    value='2'
                    text={`top versions`}
                />
            </TabList>
            {tabNumber === '1' && (
                <div className='mt-4'>
                    <DownloadsDateSelector
                        passDates={getDates}
                    ></DownloadsDateSelector>
                    <AreaChart
                        // className="w-auto"
                        data={range}
                        index='day'
                        categories={['downloads']}
                        colors={['blue']}
                        yAxisWidth={60}
                        curveType='natural'
                        valueFormatter={dataFormatter}
                    />
                </div>
            )}
            {tabNumber === '2' && (
                <div className=''>
                    <BarChart
                        // className="w-auto"
                        data={perVersion.perVersion.slice(0, 10)}
                        categories={['downloads']}
                        index={'name'}
                        colors={['blue']}
                        showGridLines={true}
                        yAxisWidth={60}
                        valueFormatter={dataFormatter}
                    />
                </div>
            )}
        </div>
    );
}
