import DistModel from '@/models/npm/dist-model';
import VersionFullModel from '@/models/version-full-model';
import { Button } from '@tremor/react';
import { Card, Bold, Text } from '@tremor/react';
import * as React from 'react';


export default function DistCard(dist: Pick<VersionFullModel, 'dist'>) {
    const {fileCount, unpackedSize, shasum, tarball} = dist.dist
    return (
        <div className='flex flex-col justify-between h-full'>
            <div className='flex flex-col gap-y-2 divide-y' >
                <Text className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`FileCount: `}
                    </Bold>
                    {fileCount}
                </Text>
                <Text className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Unpacked size: `}
                    </Bold>
                    {unpackedSize / 1000} kb
                </Text>
                <Text className='flex flex row justify-between pt-2 text-ellipsis overflow-hidden whitespace-nowrap '>
                    <Bold className='text-slate-400'>
                        {`SHA sum: `}
                    </Bold>
                    {shasum}
                </Text>
            </div>
            <Button size='xs' className='w-full' disabled>
                Download Source File
            </Button>
        </div>
    )
}