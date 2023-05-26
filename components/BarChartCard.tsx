import { Card, Title, BarChart, Subtitle } from "@tremor/react";

interface IBarCharValue {
    [key: string]: number | string;
}
interface IBarChart {
    data: IBarCharValue[]
    title: string;
    subtitle: string;
}

const BarChartCard = ({ data, title, subtitle }) => (
  <Card>
    <Title>{title}</Title>
    <Subtitle>
      {subtitle}
    </Subtitle>
    <BarChart
      className="mt-6"
      data={data}
      index="day"
      categories={["downloads"]}
      colors={["blue"]}
      yAxisWidth={48}
    />
  </Card>
);

export default BarChartCard