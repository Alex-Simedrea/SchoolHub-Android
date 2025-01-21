'use dom';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const timeData = [
  { date: new Date('2024-11-04').getTime(), value: 5 },
  { date: new Date('2024-11-05').getTime(), value: 3 },
  { date: new Date('2024-11-15').getTime(), value: 1 },
  { date: new Date('2024-12-01').getTime(), value: 2 }
];

export default function AbsencesEvolutionChart({
  lineColor,
  gridColor,
  textColor,
  width,
  data
}: {
  lineColor: string;
  gridColor: string;
  textColor: string;
  width: number;
  data: {
    date: number;
    value: number;
  }[];
  dom: import('expo/dom').DOMProps;
}) {
  let date30DaysAgo = new Date();
  date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

  return (
    <BarChart
      width={width}
      height={170}
      data={data}
      margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray='3 3' stroke={gridColor} />
      <XAxis
        dataKey='date'
        scale='time'
        type='number'
        domain={() => [date30DaysAgo.getTime(), new Date().getTime()]}
        tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
        tick={{ fontSize: 20, fontWeight: '600', fill: textColor }}
        tickMargin={16}
      />
      <YAxis
        domain={[0, 'dataMax']}
        tick={{ fontSize: 20, fontWeight: '600', fill: textColor }}
        tickMargin={16}
      />
      <Bar
        type='monotone'
        dataKey='value'
        stroke={lineColor}
        fill={lineColor}
      />
    </BarChart>
  );
}
