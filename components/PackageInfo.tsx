import { Badge, Subtitle } from '@tremor/react';
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
                <p className='text-4xl'>
                    {info.name}
                </p>

            </div>
            <Subtitle className=''>
                {info.description}
            </Subtitle>
            <div className='flex flex-wrap gap-x-0.5 gap-y-1'>
                {info.keywords?.map((k, i) => <Badge size='lg' color='blue' key={i} className='opacity-75'>{k}</Badge>)}
            </div>
        </>
    )
}