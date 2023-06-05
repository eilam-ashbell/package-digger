import { Badge, BadgeDelta, Card, Subtitle, Title } from '@tremor/react';
import * as React from 'react';

interface IPackageInfo {
    name: string;
    description: string;
    keywords: string[];
}


export default function PackageInfo(info: IPackageInfo) {
    return (
        <>
            <div className='flex flex-col gap-y-1'>
                <Title className='text-4xl'>
                    {info.name}
                </Title>

            </div>
            <Subtitle className=''>
                {info.description}
            </Subtitle>
            <div className='flex flex-wrap gap-x-0.5 gap-y-1'>
                {info.keywords.map(k => <Badge size='lg' color='blue' className='opacity-75'>{k}</Badge>)}
            </div>
        </>
    )
}