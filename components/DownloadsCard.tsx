import AdoptionModel from '@/models/united/adoption-model';
import { Card, Title, AreaChart, Badge, Button } from '@tremor/react';
import * as React from 'react';
import convert from '@/utils/convert';
import PackageFullModel from '@/models/package-full-model';

export default function DownloadsCard(data: Pick<PackageFullModel, 'adoption'>) {
    const { starsCount, forksCount, watchers, openIssues, downloads } = data.adoption
    return (
        <>
            <div className='flex flex-row justify-between'>
                <Title>Adoption</Title>
                <Title>{convert.formatNumber(downloads.lastYearTotal)} last year</Title>
            </div>
            <div className='flex justify-center gap-x-2 my-6'>
                <Button variant='secondary' color='gray'>stars: {convert.formatNumber(starsCount)}</Button>
                <Button variant='secondary' color='gray'>forks: {convert.formatNumber(forksCount)}</Button>
                <Button variant='secondary' color='gray'>open issues: {convert.formatNumber(openIssues)}</Button>
            </div>
            <AreaChart
                className=""
                data={downloads.lastYearRange}
                index="month"
                categories={["downloads"]}
                colors={["blue"]}
                yAxisWidth={60}
                curveType='natural'
            />
        </>
    )
}