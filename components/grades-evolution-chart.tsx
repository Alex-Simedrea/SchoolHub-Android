'use dom';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

const timeData = [
  { date: new Date('2024-01-01').getTime(), value: 10 },
  { date: new Date('2024-01-02').getTime(), value: 9.8 },
  { date: new Date('2024-01-15').getTime(), value: 9.9 },
  { date: new Date('2024-02-01').getTime(), value: 9.7 }
];

export default function GradesEvolutionChart({
  lineColor,
  textColor,
  gridColor,
  width,
  data
}: {
  lineColor: string;
  textColor: string;
  gridColor: string;
  width: number;
  data: {
    date: number;
    value: number;
  }[];
  dom: import('expo/dom').DOMProps;
}) {
  return (
    <LineChart
      width={width}
      height={170}
      data={data}
      margin={{ top: 0, right: 12, left: 12, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray='3 3' stroke={gridColor} />
      <XAxis
        dataKey='date'
        scale='time'
        type='number'
        domain={['dataMin', 'dataMax']}
        tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
        tick={{ fontSize: 20, fontWeight: '600', fill: textColor }}
        tickMargin={16}
      />
      <YAxis
        domain={[0, 'dataMax']}
        tick={{ fontSize: 20, fontWeight: '600', fill: textColor }}
        tickMargin={16}
        tickFormatter={(value) => value.toFixed(1)}
      />
      <Line
        type='monotone'
        dataKey='value'
        stroke={lineColor}
        dot={{ r: 4 }}
        strokeWidth={8}
      />
    </LineChart>
  );
}
