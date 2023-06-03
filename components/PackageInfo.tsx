import { Card, Subtitle, Title } from '@tremor/react';
import * as React from 'react';

interface IPackageInfo {
    name: string;
    description: string;
    keywords: string[];
}


export default function PackageInfo(info: IPackageInfo) {
    return (
        <Card className='bg-white px-8 py-4 rounded-md flex flex-col gap-y-4 text-slate-800 w-2/3'>
            <div className='flex flex-col gap-y-1'>
                <Title className='text-4xl'>
                    {info.name}
                </Title>

            </div>
            <Subtitle className=''>
                {info.description}
            </Subtitle>
            <div className='flex flex-wrap gap-x-1 gap-y-1'>
                {info.keywords.map(k => <span className='bg-neutral-200 px-3 py-1 rounded text-xs'>{k}</span>)}
            </div>
        </Card>
    )
}