import { Card, Bold, Text } from '@tremor/react';
import { versions } from 'process';
import * as React from 'react';
import VersionSelect from './VersionSelect';
import VersionInfoModel from '@/models/united/version-info-model';

export default function VersionsInfo(vInfo: VersionInfoModel) {
    const { currentVersion, versions, versionsCount, created, lastModified, lastPublish } = vInfo
    return (
        <>
            <VersionSelect versions={versions} current={currentVersion} />
            <div className='flex flex-col gap-y-2 divide-y' >
                <Text className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Current: `}
                    </Bold>
                    {currentVersion}
                </Text>
                <Text className='flex flex row justify-between  pt-2'>
                    <Bold className='text-slate-400'>
                        {`Versions count: `}
                    </Bold>
                    {versionsCount}
                </Text>
                <Text className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Created: `}
                    </Bold>
                    {created.toLocaleDateString('he-il')}
                </Text>
                <Text className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Last publish: `}
                    </Bold>
                    {lastPublish.toLocaleDateString('he-il')}
                </Text>
                <Text className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Last modified: `}
                    </Bold>
                    {lastModified.toLocaleDateString('he-il')}
                </Text>
            </div>
        </>
    )
}