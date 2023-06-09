import { Bold, Text } from '@tremor/react';
import * as React from 'react';
import VersionSelect from './VersionSelect';
import PackageFullModel from '@/models/package-full-model';

export default function VersionsInfo(packageInfo: PackageFullModel) {
    return (
        <>
            <VersionSelect versions={packageInfo.versions} />
            <div className='flex flex-col gap-y-2 divide-y' >
                <Text className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Current: `}
                    </Bold>
                    {packageInfo.versions?.current}
                </Text>
                <Text className='flex flex row justify-between  pt-2'>
                    <Bold className='text-slate-400'>
                        {`Versions count: `}
                    </Bold>
                    {packageInfo.versions?.count}
                </Text>
                <Text className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Created: `}
                    </Bold>
                    {new Date(packageInfo.metadata?.package.created).toLocaleDateString('he-il')}
                </Text>
                <Text className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Last publish: `}
                    </Bold>
                    {new Date(packageInfo.versions?.tags[packageInfo.versions?.tags.length - 1].publishedAt).toLocaleDateString('he-il')}
                </Text>
                <Text className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Last modified: `}
                    </Bold>
                    {new Date(packageInfo.metadata?.package.created).toLocaleDateString('he-il')}
                </Text>
            </div>
        </>
    )
}