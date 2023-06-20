import VersionFullModel from '@/models/version-full-model';
import { Button } from '@tremor/react';
import Link from 'next/link';
import SectionTitle from './SectionTitle';
import CopyBox from './CopyBox';
import KeyDataBar from './KeyDataBar';

interface IDistSection {
    packageVersion?: string;
    dist: Pick<VersionFullModel, 'dist'>;
}
export default function DistCard({ dist, packageVersion }: IDistSection) {
    const { fileCount, unpackedSize, shasum, tarball } = dist.dist;
    return (
        <div className='flex flex-col justify-between h-full'>
            <SectionTitle
                title='Dist'
                subTitle={'v' + packageVersion}
            />
                    <div className='flex flex-col gap-y-2'>
            <KeyDataBar
                data={[
                    { title: 'file count', value: fileCount || 'unknown' },
                    {
                        title: 'unpacked size',
                        value: `${unpackedSize / 1000} kb`,
                    },
                ]}
            />
                <CopyBox text={shasum} title='SHA:' />
            </div>
            <Link
                href={tarball}
                className='mt-4'
            >
                <Button
                    size='lg'
                    className='w-full'
                >
                    Download Source
                </Button>
            </Link>
        </div>
    );
}
