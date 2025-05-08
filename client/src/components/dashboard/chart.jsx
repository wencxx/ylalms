import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { activity: "January", male: 186, female: 80 },
  { activity: "February", male: 305, female: 200 },
  { activity: "March", male: 237, female: 120 },
  { activity: "April", male: 73, female: 190 },
  { activity: "May", male: 209, female: 130 },
  { activity: "June", male: 214, female: 140 },
]

const chartConfig = {
  male: {
    label: "Male",
    color: "hsl(var(--chart-1))",
  },
  female: {
    label: "Female",
    color: "hsl(var(--chart-2))",
  },
}

export default function Chart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart title nadi</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="activity"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="male" fill="var(--color-male)" radius={4} />
            <Bar dataKey="female" fill="var(--color-female)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
