import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricsChartProps {
  title: string;
  description?: string;
  data: any[];
  type?: "line" | "area" | "bar";
  dataKey: string;
  dataKeySecondary?: string;
  color?: string;
  colorSecondary?: string;
  height?: number;
}

export function MetricsChart({
  title,
  description,
  data,
  type = "line",
  dataKey,
  dataKeySecondary,
  color = "#3b82f6",
  colorSecondary = "#8b5cf6",
  height = 300,
}: MetricsChartProps) {
  const chartProps = {
    data,
    margin: { top: 5, right: 30, left: 0, bottom: 5 },
  };

  let chart;

  if (type === "area") {
    chart = (
      <AreaChart {...chartProps}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#e2e8f0" }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fillOpacity={1}
          fill="url(#colorGradient)"
        />
      </AreaChart>
    );
  } else if (type === "bar") {
    chart = (
      <BarChart {...chartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#e2e8f0" }}
        />
        <Legend />
        <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
        {dataKeySecondary && (
          <Bar dataKey={dataKeySecondary} fill={colorSecondary} radius={[8, 8, 0, 0]} />
        )}
      </BarChart>
    );
  } else {
    chart = (
      <LineChart {...chartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="name" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#e2e8f0" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, r: 4 }}
          activeDot={{ r: 6 }}
        />
        {dataKeySecondary && (
          <Line
            type="monotone"
            dataKey={dataKeySecondary}
            stroke={colorSecondary}
            strokeWidth={2}
            dot={{ fill: colorSecondary, r: 4 }}
            activeDot={{ r: 6 }}
          />
        )}
      </LineChart>
    );
  }

  return (
    <Card className="nexus-card border-border/50">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {chart}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
