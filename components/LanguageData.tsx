import * as React from 'react';
import { BarList, Card, Title, Bold, Flex, Text } from "@tremor/react";

interface ILanguages {
    languages: Record<string, number>;
}

export default function LanguageData(langs: ILanguages) {
    const { languages } = langs
    const total = Object.values(languages).reduce((sum, current) =>
        sum + current, 0)
    const data = []
    for (let l of Object.entries(languages)) {
        if (l[1] / total * 100 < 1) {
            const isOtherExist = data.findIndex(d => d.name === 'other')
            if (isOtherExist >= 0) {
                data[isOtherExist] = { name: 'other', value: Number(data[isOtherExist]['value']) + Number((l[1] / total * 100).toFixed(1)) }
            } else {
                data.push({ name: 'other', value: (l[1] / total * 100).toFixed(1) })
            }
        } else {
            data.push({ name: l[0], value: (l[1] / total * 100).toFixed(1) })
        }
    }
    return (
        <div>
            <Flex className="mt-4">
                <Text>
                    <Bold>language</Bold>
                </Text>
                <Text>
                    <Bold>%</Bold>
                </Text>
            </Flex>
            <BarList data={data} className="mt-2" />
        </div>
    )
}


