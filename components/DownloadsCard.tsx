import AdoptionModel from '@/models/united/adoption-model';
import { Card, Title, AreaChart, Badge, Button } from '@tremor/react';
import * as React from 'react';
import convert from '@/utils/convert';

export default function DownloadsCard(data: AdoptionModel) {
    const { stars, forks, watchers, network, subscribers, openIssues, downloads } = data
    return (
        <>
            <div className='flex flex-row justify-between'>
                <Title>Adoption</Title>
                <Title>{convert.formatNumber(downloads.downloads.reduce((sum, current) =>
                    sum + current.downloads, 0
                ))} last month</Title>
            </div>
            <div className='flex justify-center gap-x-2 my-6'>
                <Button variant='secondary' color='gray'>stars: {convert.formatNumber(stars)}</Button>
                <Button variant='secondary' color='gray'>forks: {convert.formatNumber(forks)}</Button>
                <Button variant='secondary' color='gray'>open issues: {convert.formatNumber(openIssues)}</Button>
            </div>
            <AreaChart
                className=""
                data={downloads.downloads}
                index="day"
                categories={["downloads"]}
                colors={["blue"]}
                yAxisWidth={60}
                curveType='natural'
            />
        </>
    )
}