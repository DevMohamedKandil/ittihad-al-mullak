"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyData = [
  { month: "يناير", collected: 18500, target: 24000 },
  { month: "فبراير", collected: 21000, target: 24000 },
  { month: "مارس", collected: 19500, target: 24000 },
  { month: "أبريل", collected: 22500, target: 24000 },
  { month: "مايو", collected: 20000, target: 24000 },
  { month: "يونيو", collected: 23500, target: 24000 },
];

const paymentStatusData = [
  { name: "مدفوع", value: 15, color: "oklch(0.55 0.14 155)" },
  { name: "جزئي", value: 5, color: "oklch(0.75 0.15 85)" },
  { name: "غير مدفوع", value: 4, color: "oklch(0.55 0.2 25)" },
];

export function CollectionChart() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">التحصيل الشهري</CardTitle>
          <CardDescription>مقارنة التحصيل بالمستهدف</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient
                    id="collectedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="oklch(0.55 0.14 155)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.55 0.14 155)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="oklch(0.88 0.01 240)"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.45 0.02 240)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "oklch(0.45 0.02 240)", fontSize: 12 }}
                  tickFormatter={(value) => `${value / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(1 0 0)",
                    border: "1px solid oklch(0.88 0.01 240)",
                    borderRadius: "8px",
                    fontFamily: "inherit",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} ج.م`]}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="oklch(0.55 0.14 155)"
                  strokeWidth={2}
                  fill="url(#collectedGradient)"
                  name="المحصل"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="oklch(0.5 0.15 240)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="none"
                  name="المستهدف"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">حالة السداد</CardTitle>
          <CardDescription>توزيع الشقق حسب حالة الدفع</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(1 0 0)",
                    border: "1px solid oklch(0.88 0.01 240)",
                    borderRadius: "8px",
                    fontFamily: "inherit",
                  }}
                  formatter={(value: number) => [`${value} شقة`]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2">
            {paymentStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
