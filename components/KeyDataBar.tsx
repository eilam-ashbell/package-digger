import * as React from 'react';

interface IKeyDataBar {
    data: { title: string; value: string | number }[];
}

export default function KeyDataBar({ data }: IKeyDataBar) {
    return (
        <div className='w-full flex flex-row flex-wrap justify-between divide-x text-sm text-gray-400 whitespace-nowrap pb-4 bg-slate-100 py-4 px-4 rounded-md shadow-inner'>
            {data.map((k, i) => (
                <div className='px-6 flex flex-col gap-y grow' key={i}>
                    <span>{k.title}</span>
                    <span className='text-lg text-gray-700 font-medium'>
                        {k.value}
                    </span>
                </div>
            ))}
        </div>
    );
}