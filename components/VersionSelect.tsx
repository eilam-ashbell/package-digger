'use client'
import { SelectBox, SelectBoxItem } from '@tremor/react';
import * as React from 'react';
import { Interface } from 'readline';

interface IAllVersions {
    versions: string[]
    current: string
}

export default function VersionSelect(versions: IAllVersions) {
    const [value, setValue] = React.useState(versions.current);

  return (
    <SelectBox value={value} onValueChange={setValue} disabled>
        {
            versions.versions.sort().reverse().map( v => 
                <SelectBoxItem value={v} text={v}/>
                )
        }
      </SelectBox>
  )
}