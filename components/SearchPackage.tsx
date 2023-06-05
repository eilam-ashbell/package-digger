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
    // const [pkg, setPkg] = React.useState<{ value: string, label: string }>()
    // const [options, setOptions] = React.useState<{ value: string, label: string }[]>()

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     const packageName = convert.url(pkg.value)
    //     // const latest = await npm.getPackageLatestVersion(pkg.value)
    //     e.target.reset()
    //     router.push(`/package/${packageName}`)
    // }

    // const handleChange = async (e) => {
    //     // e.preventDefault()
    //     setPkg(e.target.value)
    //     const res = await npm.searchPackageName(e.target.value, 5)
    //     console.log(res);
    //     const suggestions = res.map( r => ({value: r.package.name, label: r.package.name}))
    //     setOptions(suggestions)
    // }

    // const handleSelect = (packageName: string) => {
    //     setPkg(null)
    //     setOptions(null)
    //     router.push(`/package/${packageName}`)
    // }

    // return (
    // <form onSubmit={handleSubmit}>
    //     <input type="text" name='pkgName' onChange={handleChange} value={route}/>

    //     {/* <datalist id="packages">
    //         {searchOptions?.map(p =>
    //             <option value={p.package.name} key={`${p.package.name}@${p.package.version}`}>{`${p.package.name}@${p.package.version}`}
    //             </option>
    //         )}
    //     </datalist> */}
    //     <div className={`absolute z-50 bg bg-white divide-y divide-slate-100 cursor-pointer`}>
    //         {searchOptions?.map(p =>
    //             <div className={`px-6 py-2 hover:bg-slate-100 w-100`} key={`${p.package.name}`}>
    //                 <div className={`flex flex-row justify-between`} onClick={() => handleSelect(p.package.name)}>
    //                     <span className={`text-l`}>{`${p.package.name}`}</span>
    //                     <span className={`bg-slate-300 px-2 py-0.5 text-sm rounded self-start`}>{p.score.final.toFixed(2)}</span>
    //                 </div>
    //                 <span className={`text-xs`}>{`v${p.package.version}`}</span>
    //             </div>
    //         )}
    //     </div>

    //     <button type="submit">Search</button>
    // </form>

    //         <AsyncSelect cacheOptions defaultOptions loadOptions={promiseOptions} />
    //     )

    const [selectedPkg, setSelectedPkg] = React.useState('')
    const [query, setQuery] = React.useState<string>('')
    const [options, setOptions] = React.useState<SearchPackageResultsModel[]>()

    const handleChange = async (event) => {
        setQuery(event.target.value)
        const res = await npm.searchPackageName(event.target.value, 5)
        setOptions(res)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const packageName = convert.url(selectedPkg)
        e.target.reset()
        router.push(`/npm/${packageName}`)
    }

    const handleSelect = (pkgName: string) => {
        const packageName = convert.url(pkgName)
        router.push(`/npm/${packageName}`)
    }

    const handleKeyDown = (event, pkgName) => {
        console.log('in');

        if (event.key === 'Enter') {
            console.log('enter');

            const packageName = convert.url(pkgName)
            router.push(`/npm/${packageName}`)
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
                            <Combobox.Option key={opt.package.name} value={opt.package.name} onClick={() => handleSelect(opt.package.name)} onKeyDown={() => handleKeyDown(event, opt.package.name
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
            <Button type='submit' icon={SearchIcon} className='pr-2'/>
        </form>
    )

}