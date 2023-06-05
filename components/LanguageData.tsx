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
        data.push({name: l[0], value: (l[1]/total*100).toFixed(2)})
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


