import * as React from 'react';

interface IKeyDataBar {
    data: { title: string; value: string | number }[];
}

export default function KeyDataBar({ data }: IKeyDataBar) {
    return (
        <div className='flex flex-row flex-wrap divide-x text-sm text-gray-400 whitespace-nowrap pb-4'>
            {data.map((k) => (
                <div className='px-6 flex flex-col gap-y'>
                    <span>{k.title}</span>
                    <span className='text-lg text-gray-700 font-medium'>
                        {k.value}
                    </span>
                </div>
            ))}
        </div>
    );
}