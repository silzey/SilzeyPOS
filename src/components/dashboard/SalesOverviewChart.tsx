
"use client"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';

const generateRandomData = () => [
  { name: 'Jan', sales: Math.floor(Math.random() * 4000) + 1000 },
  { name: 'Feb', sales: Math.floor(Math.random() * 4000) + 1000 },
  { name: 'Mar', sales: Math.floor(Math.random() * 4000) + 1000 },
  { name: 'Apr', sales: Math.floor(Math.random() * 4000) + 1000 },
  { name: 'May', sales: Math.floor(Math.random() * 4000) + 1000 },
  { name: 'Jun', sales: Math.floor(Math.random() * 4000) + 1000 },
];

export const SalesOverviewChart = () => {
  const [chartData, setChartData] = useState<Array<{name: string, sales: number}>>([]);

  useEffect(() => {
    setChartData(generateRandomData());
  }, []);

  return (
  <Card className="shadow-lg">
    <CardHeader>
      <CardTitle className="font-headline text-primary">Sales Overview</CardTitle>
      <CardDescription>Monthly sales data for the last 6 months (mock data).</CardDescription>
    </CardHeader>
    <CardContent className="pl-2">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.3 }}
            contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}
            labelStyle={{ color: "hsl(var(--popover-foreground))", fontWeight: "bold" }}
            itemStyle={{ color: "hsl(var(--popover-foreground))" }}
          />
          <Legend wrapperStyle={{ color: "hsl(var(--muted-foreground))", paddingTop: '10px' }} />
          <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
  );
};
