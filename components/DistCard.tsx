import DistModel from '@/models/npm/dist-model';
import { Button } from '@tremor/react';
import * as React from 'react';


export default function DistCard(dist: DistModel) {
    return (
        <>
            <div>
                <div>
                    fileCount: {dist.fileCount}
                </div>
                <div>
                    unpackedSize: {dist.unpackedSize / 1000} kb
                </div>
                <div>
                    SHA sum: {dist.shasum}
                </div>
            </div>
            <Button size='xs' className='w-full'>
                Download
            </Button>
        </>
    )
}