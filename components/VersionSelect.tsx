'use client'
import PackageFullModel from '@/models/package-full-model';
import { SelectBox, SelectBoxItem } from '@tremor/react';
import * as React from 'react';
import { Interface } from 'readline';

interface IAllVersions {
    versions: string[]
    current: string
}

export default function VersionSelect(versions: Pick<PackageFullModel, 'versions'>) {
    const [value, setValue] = React.useState(versions.versions.current);

  return (
    <SelectBox value={value} onValueChange={setValue} disabled>
        {
            versions.versions.tags.sort().reverse().map( v => 
                <SelectBoxItem value={v.tag} text={v.name}/>
                )
        }
      </SelectBox>
  )
}