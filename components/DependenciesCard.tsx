'use client'
import * as React from 'react';
import { AreaChart, Card, LineChart, Subtitle, Tab, TabList, Text, Title } from '@tremor/react';
import npm from '@/utils/npm';

interface Deps {
    direct?: Record<string, string>
    indirect?: Record<string, string>
    dev?: Record<string, string>
}
export default function DependenciesCard(deps: Deps) {
    const [value, setValue] = React.useState("1");

    return (
        <>
            <TabList value={value} onValueChange={(value) => setValue(value)} >
                <Tab value="1" text={`Direct (${deps.direct && Object.entries(deps.direct).length || 0})`} />
                <Tab value="2" text={`Dev (${deps.dev && Object.entries(deps.dev).length || 0})`} />
                <Tab value="3" text={`Indirect (${deps.indirect && Object.entries(deps.indirect).length || 0})`} />
            </TabList>
            {
                (value === "1") && deps.direct && <div className='h-60 overflow-y-scroll'>
                    {Object.entries(deps.direct).map(d => <div className='flex justify-between'><div>{d[0]}</div><div>{d[1]}</div></div>)}
                </div>}
            {
                (value === "2") && deps.dev && <div className='h-60 overflow-y-scroll'>
                    {Object.entries(deps.dev).map(d => <div className='flex justify-between'><div>{d[0]}</div><div>{d[1]}</div></div>)}
                </div>
            }
            {
                (value === "3") && deps.indirect && <div className='h-60 overflow-y-scroll'>
                    {Object.entries(deps.indirect).map(d => <div className='flex justify-between'><div>{d[0]}</div><div>{d[1]}</div></div>)}
                </div>
            }
        </>
    )
}