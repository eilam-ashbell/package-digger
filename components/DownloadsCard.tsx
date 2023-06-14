import { Title, AreaChart, Button } from '@tremor/react';
import * as React from 'react';
import PackageFullModel from '@/models/package-full-model';
import abbreviate from 'number-abbreviate'

export default function DownloadsCard(data: Pick<PackageFullModel, 'adoption'>) {
    const { starsCount, forksCount, watchers, openIssues, downloads } = data.adoption
    return (
        <>
            <div className='flex flex-row justify-between'>
                <Title>Adoption</Title>
                <Title>{abbreviate(downloads.lastYearTotal, 1)} last year</Title>
            </div>
            <div className='flex justify-center gap-x-2 my-6'>
                <Button variant='secondary' color='gray'>stars: {abbreviate(starsCount, 1)}</Button>
                {/* <Button variant='secondary' color='gray'>watchers: {abbreviate(watchers, 1)}</Button> */}
                <Button variant='secondary' color='gray'>forks: {abbreviate(forksCount, 1)}</Button>
                <Button variant='secondary' color='gray'>open issues: {abbreviate(openIssues, 1)}</Button>
            </div>
            <AreaChart
                className=""
                data={downloads.lastYearRange}
                index="month"
                categories={["downloads"]}
                colors={["blue"]}
                yAxisWidth={80}
                curveType='natural'
            />
        </>
    )
}