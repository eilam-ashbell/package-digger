import { Card, Title, AreaChart } from '@tremor/react';
import * as React from 'react';

interface IDownloadsData {
    downloads: { downloads: number, day: string }[]
}

export default function DownloadsCard(downloads: IDownloadsData) {
    return (
        <Card>
            <div className='flex flex-row justify-between'>
                <Title>Downloads</Title>
                <Title>{new Intl.NumberFormat().format(downloads.downloads.reduce((sum, current) =>

                    sum + current.downloads, 0
                ))} in last week</Title>
            </div>
            <AreaChart
                className="mt-6"
                data={downloads.downloads}
                index="day"
                categories={["downloads"]}
                colors={["blue"]}
                yAxisWidth={60}
                curveType='natural'
            />
        </Card>
    )
}