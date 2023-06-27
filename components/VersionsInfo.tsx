import { Bold } from '@tremor/react';
import * as React from 'react';
import VersionSelect from './VersionSelect';
import PackageFullModel from '@/models/package-full-model';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export default function VersionsInfo(packageInfo: PackageFullModel) {    
    return (
        <>
            <VersionSelect versions={packageInfo.versions} />
            <div className='flex flex-col gap-y-2 divide-y' >
                <p className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Current: `}
                    </Bold>
                    {packageInfo.versions?.current}
                </p>
                <p className='flex flex row justify-between  pt-2'>
                    <Bold className='text-slate-400'>
                        {`Versions count: `}
                    </Bold>
                    {packageInfo.versions?.count}
                </p>
                <p className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Created: `}
                    </Bold>
                    {dayjs(new Date(packageInfo.metadata?.package.created)).fromNow()}
                </p>
                <p className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Last publish: `}
                    </Bold>
                    {dayjs(new Date(packageInfo.versions?.tags[packageInfo.versions?.tags.findIndex( v => v.tag === packageInfo.versions.current)].publishedAt)).fromNow()}
                </p>
                <p className='flex flex row justify-between pt-2'>
                    <Bold className='text-slate-400'>
                        {`Last modified: `}
                    </Bold>
                    {dayjs(new Date(packageInfo.metadata?.package.lastModified)).fromNow()}
                </p>
            </div>
        </>
    )
}