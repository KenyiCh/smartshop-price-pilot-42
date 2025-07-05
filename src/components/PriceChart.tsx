
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';
import { formatPrice } from '@/utils/priceUtils';

const allData = {
  days: [
    { date: '2024-06-10', price: 7596.50 },
    { date: '2024-06-11', price: 7620.25 },
    { date: '2024-06-12', price: 7580.75 },
    { date: '2024-06-13', price: 7615.00 },
    { date: '2024-06-14', price: 7590.50 },
    { date: '2024-06-15', price: 7605.25 },
    { date: '2024-06-16', price: 7596.50 },
  ],
  weeks: [
    { date: 'Sem 1 Jun', price: 7740.00 },
    { date: 'Sem 2 Jun', price: 7680.50 },
    { date: 'Sem 3 Jun', price: 7620.25 },
    { date: 'Sem 4 Jun', price: 7596.50 },
  ],
  months: [
    { date: '2023-10', price: 8740.99 },
    { date: '2023-11', price: 8359.75 },
    { date: '2023-12', price: 7977.50 },
    { date: '2024-01', price: 7596.50 },
    { date: '2024-02', price: 7787.25 },
    { date: '2024-03', price: 7596.50 },
  ]
};

const PriceChart = () => {
  const [timeRange, setTimeRange] = useState<'days' | 'weeks' | 'months'>('months');

  const data = allData[timeRange];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Evolución de Precios</h3>
        <Select value={timeRange} onValueChange={(value: 'days' | 'weeks' | 'months') => setTimeRange(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="days">Últimos días</SelectItem>
            <SelectItem value="weeks">Semanas</SelectItem>
            <SelectItem value="months">Meses</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`S/ ${formatPrice(Number(value))}`, 'Precio']}
              labelFormatter={(label) => `Período: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ fill: '#8884d8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
