"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface VisitChartProps {
  data: {
    date: string;
    desktop: number;
    mobile: number;
  }[];
}

export function VisitChart({ data }: VisitChartProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Website Visits</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: any) =>
                  new Date(value).toLocaleDateString()
                }
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="desktop"
                stackId="1"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="mobile"
                stackId="1"
                stroke="#db2777"
                fill="#ec4899"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
