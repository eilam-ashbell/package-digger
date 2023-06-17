import { Badge } from '@tremor/react';
import * as React from 'react';

interface IKeyWordsList {
    keywords: string[];
}
export default function KeyWordsList({ keywords }: IKeyWordsList) {
    return (
        <div className='flex flex-row flex-wrap gap-1'>
            {keywords.map((k, i) => (
                <Badge
                    size='lg'
                    color='blue'
                    key={i}
                    className='opacity-75'
                >
                    {k}
                </Badge>
            ))}
        </div>
    );
}
