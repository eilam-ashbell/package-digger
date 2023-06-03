import { Card, Bold, Text } from '@tremor/react';
import { versions } from 'process';
import * as React from 'react';
import VersionSelect from './VersionSelect';

interface IVersionsInfo {
    current: string
    versions: string[]
    count: number
    lastPublish: string
    lastModified: string
}
export default function VersionsInfo(vInfo: IVersionsInfo) {
    return (
        <Card className='w-1/3 flex flex-col gap-y-2'>
            <VersionSelect versions={vInfo.versions} current={vInfo.current} />
            <div className='flex flex-col gap-y-1'>
                <Text>
                    <Bold className='text-slate-400'>
                        {`Current: `}
                    </Bold>
                    {vInfo.current}
                </Text>
                <Text>
                    <Bold className='text-slate-400'>
                        {`Versions count: `}
                    </Bold>
                    {vInfo.count}
                </Text>
                <Text>
                    <Bold className='text-slate-400'>
                        {`Last publish: `}
                    </Bold>
                    {vInfo.lastPublish}
                </Text>
                <Text>
                    <Bold className='text-slate-400'>
                        {`Last modified: `}
                    </Bold>
                    {vInfo.lastModified}
                </Text>
            </div>
        </Card>
    )
}