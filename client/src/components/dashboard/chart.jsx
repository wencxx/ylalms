import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  averagePercentage: {
    label: "Average %",
    color: "hsl(var(--chart-1))",
  },
};

export default function Chart({ chartData, type }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{type} Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-96">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quiz"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="averagePercentage"
              fill="var(--color-averagePercentage)"
              radius={6}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm">
        <div className="leading-none text-muted-foreground">
          Showing average {type} scores (in %)
        </div>
      </CardFooter>
    </Card>
  );
}
