'use client'
import * as React from 'react';
import { AreaChart, Button, Card, LineChart, Subtitle, Tab, TabList, Text, Title } from '@tremor/react';
import npm from '@/utils/npm';
import UnitedDepsModel from '@/models/united/deps-model';
import { DownloadIcon } from '@heroicons/react/solid'
import DependencyListItem from './DependencyListItem';

export default function DependenciesCard(deps: UnitedDepsModel) {
    const [value, setValue] = React.useState("1");
    const { direct, indirect, dev } = deps;
    return (
        <div className='flex flex-col gap-x-4'>
            <Title>Dependencies</Title>
            <div className='w-full mt-4'>
                <TabList value={value} onValueChange={(value) => setValue(value)} >
                    <Tab value="1" text={`Direct (${direct && Object.entries(direct).length || 0})`} />
                    <Tab value="2" text={`Dev (${dev && Object.entries(dev).length || 0})`} />
                    <Tab value="3" text={`Indirect (${indirect && Object.entries(indirect).length || 0})`} />
                </TabList>
                {
                    (value === "1") && direct && <div className='h-60 overflow-y-scroll'>
                        {Object.entries(direct).map(d => <DependencyListItem depItem={d} />)}
                    </div>}
                {
                    (value === "2") && dev && <div className='h-60 overflow-y-scroll'>
                        {Object.entries(dev).map(d => <DependencyListItem depItem={d} />)}
                    </div>
                }
                {
                    (value === "3") && indirect && <div className='h-60 overflow-y-scroll'>
                        {Object.entries(indirect).map(d => <DependencyListItem depItem={d} />)}
                    </div>
                }
            </div>
            <div className='w-full flex flex-row gap-x-1 pt-4'>
                <Button variant='primary' className='w-1/4' icon={DownloadIcon} disabled>All</Button>
                <Button variant='secondary' className='w-1/4' icon={DownloadIcon} disabled>Direct</Button>
                <Button variant='secondary' className='w-1/4 border-0' icon={DownloadIcon} disabled>Indirect</Button>
                <Button variant='secondary' className='w-1/4 border-0' icon={DownloadIcon} disabled>Dev</Button>
            </div>
        </div>
    )
}