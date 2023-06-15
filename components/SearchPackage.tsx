"use client"
import * as React from 'react';
import { useRouter } from 'next/navigation';
import npm from '@/utils/npm';
import SearchPackageResultsModel from '@/models/npm/search-package-results-model';
import convert from '@/utils/convert';
import AsyncSelect from 'react-select';
import { Combobox } from '@headlessui/react'
import { Button } from '@tremor/react';
import { SearchIcon } from '@heroicons/react/solid'

export default function SearchPackage() {
    const router = useRouter();

    const [selectedPkg, setSelectedPkg] = React.useState('')
    const [query, setQuery] = React.useState<string>('')
    const [options, setOptions] = React.useState<SearchPackageResultsModel[]>()

    const handleChange = async (event) => {
        setQuery(event.target.value[0])
        const res = await npm.searchPackageName(event.target.value, 5)
        setOptions(res)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const packageName = convert.url(selectedPkg)
        e.target.reset()
        router.push(`/npm/${packageName}`)
    }

    const handleSelect = (pkg: string[]) => {
        const packageName = convert.url(pkg[0])
        router.push(`/npm/${packageName}/${pkg[1]}`)
    }

    const handleKeyDown = (event, pkg: string[]) => {

        if (event.key === 'Enter') {

            const packageName = convert.url(pkg[0])
            router.push(`/npm/${packageName}/${pkg[1]}`)
        }
    };

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-row gap-x-1 justify-center'>
            <div className='relative w-3/6'>
                <Combobox value={selectedPkg} onChange={setSelectedPkg}>
                    <Combobox.Input
                        onChange={(event) => handleChange(event)}
                        className={`w-full rounded-md border border-gray-300 px-3 py-2 text-lg leading-4 font-light text-slate-700 bg-slate-100 pb-3`}
                        placeholder='search...'
                    />
                    <Combobox.Options className='absolute z-50 bg bg-white divide-y divide-slate-100 cursor-pointer w-full rounded-md overflow-hidden shadow-lg'>
                        {options?.map((opt) => (
                            <Combobox.Option key={opt.package.name} value={[opt.package.name, opt.package.version]} onClick={() => handleSelect([opt.package.name, opt.package.version])} onKeyDown={() => handleKeyDown(event, [opt.package.name, opt.package.version]
                            )}>
                                {({ active, selected }) => (
                                    <div className={`px-6 py-2 hover:bg-slate-50 w-full flex flex-col gap-y-2 ${active ? 'bg-slate-100' : null} ${selected ? 'bg-slate-200' : null}`} key={`${opt.package.name}`}>
                                        <div className={`flex flex-row justify-between`}>
                                            <span className={`text-l  font-bold `}>{`${opt.package.name}`}</span>
                                            {/* <span className={`bg-slate-300 px-2 py-0.5 text-sm rounded self-start`}>{opt.score.final.toFixed(2)}</span> */}
                                        </div>
                                        <span className={`text-sm font-light`}>{`${opt.package.description}`}</span>

                                        <span className={`text-xs`}>{`v${opt.package.version}`}</span>
                                    </div>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </Combobox>
            </div>
            <Button type='submit' icon={SearchIcon} className='pr-2' />
        </form>
    )

}