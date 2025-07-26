"use client";
import styled from "styled-components";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useDarkMode } from "@/hooks";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { Heading } from "@/components/typography";
import { DashboardBox } from "../dashboard";
import { useSearchParams } from "next/navigation";
import { useGetStorageReportsWithUsers } from "@/hooks/reports";
import { Spinner } from "@/components/ui";

const StyledSalesChart = styled(DashboardBox)`
    grid-column: 1 / -1;
    height: fit-content;

    /* Hack to change grid line colors */
    & .recharts-cartesian-grid-horizontal line,
    & .recharts-cartesian-grid-vertical line {
        stroke: var(--color-grey-300);
    }
`;

function SalesChart() {
    const {StorageReportsUsers,isLoading,error}=useGetStorageReportsWithUsers();
    const { isDarkMode } = useDarkMode();
    const searchParams = useSearchParams();
    const numDay = searchParams.get("days");
    const allDates = eachDayOfInterval({
        start: subDays(new Date(), (numDay?(parseInt(numDay)):7) - 1),
        end: new Date(),
    });
    const data = allDates.map((date) => {
        return {
            label: format(date, "MMM dd"),
            totalPurchases: StorageReportsUsers?.data?.reports
                ?.filter((Report: any) =>
                    isSameDay(date, new Date(Report.created_at))&&Number(Report.quantity) > 0
                )
                .reduce((acc: any, cur: any) => acc + Number(cur.total_cost), 0),
            totalAverage: StorageReportsUsers?.data?.reports
                ?.filter((Report: any) =>
                    isSameDay(date, new Date(Report.created_at))&&Number(Report.quantity) > 0
                )
                .reduce((acc: any, cur: any) => acc + (Number(cur.total_cost)/Number(cur.quantity)), 0),
        };
    });
    const colors = isDarkMode
        ? {
              totalPurchases: {
                  stroke: "var(--color-brand-600)",
                  fill: "var(--color-brand-600)",
              },
              totalAverage: { stroke: "#22c55e", fill: "#22c55e" },
              text: "#e5e7eb",
              background: "#18212f",
          }
        : {
              totalPurchases: {
                  stroke: "var(--color-brand-600)",
                  fill: "var(--color-brand-200)",
              },
              totalAverage: { stroke: "#16a34a", fill: "#dcfce7" },
              text: "#374151",
              background: "#fff",
          };
          const numberFormatter = (value: number) =>
            new Intl.NumberFormat("en-GB", { 
                maximumFractionDigits: 0 
            }).format(value);
    if (isLoading) return <Spinner />;
    return (
        <StyledSalesChart>
            <Heading as="h2">
                Purchases from {format(allDates.at(0) as any, "MMM dd yyyy")}{" "}
                &mdash; {format(allDates.at(-1) as any, "MMM dd yyyy")}{" "}
            </Heading>
            <ResponsiveContainer width="100%" height={300} aspect={3.6}>
                <AreaChart data={data}>
                    <XAxis
                        dataKey="label"
                        tick={{ fill: colors.text }}
                        tickLine={{ stroke: colors.text }}
                    />
                    <YAxis
                        unit="£"
                        tick={{ fill: colors.text }}
                        tickLine={{ stroke: colors.text }}
                        tickFormatter={numberFormatter}
                    />
                    <CartesianGrid strokeDasharray="4" />
                    <Tooltip
                        contentStyle={{ backgroundColor: colors.background }}
                        // content={({ active, payload }) => {
                        //     if (active && payload && payload.length) {
                        //         return (
                        //             <div>
                        //                 <p>{`${numberFormatter(payload[0].value)} £`}</p>
                        //             </div>
                        //         );
                        //     }
                        //     return null;
                        // }}
                    />
                    <Area
                        dataKey="totalPurchases"
                        type="monotone"
                        stroke={colors.totalPurchases.stroke}
                        fill={colors.totalPurchases.fill}
                        strokeWidth={2}
                        name="Total sales"
                        unit="£"
                    />
                    <Area
                        dataKey="totalAverage"
                        type="monotone"
                        stroke={colors.totalAverage.stroke}
                        fill={colors.totalAverage.fill}
                        strokeWidth={2}
                        name="Total avarage"
                        unit="£"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </StyledSalesChart>
    );
}

export default SalesChart;
