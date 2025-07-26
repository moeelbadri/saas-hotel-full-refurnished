"use client";
import styled from "styled-components";
import DashboardBox from "./DashboardBox";
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
import { formatCurrency } from "@/utils/helpers";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const StyledSalesChart = styled(DashboardBox)`
    grid-column: 1 / -1;
    height: fit-content;

    /* Hack to change grid line colors */
    & .recharts-cartesian-grid-horizontal line,
    & .recharts-cartesian-grid-vertical line {
        stroke: var(--color-grey-300);
    }

    @media (max-width: 1200px) {
        grid-column: 1 / -1;
    }

    @media (max-width: 768px) {
        /* Chart specific mobile optimizations */
        & .recharts-responsive-container {
            min-height: 250px !important;
        }
    }

    @media (max-width: 480px) {
        /* Further mobile optimizations */
        & .recharts-responsive-container {
            min-height: 200px !important;
        }
        
        & .recharts-tooltip-wrapper {
            font-size: 1.2rem !important;
        }
    }
`;

function SalesChart({ bookings,storage, numDays }: any) {
    const { isDarkMode } = useDarkMode();
    const Language = useSettingsStore(state => state.Language);
    const allDates = eachDayOfInterval({
        start: subDays(new Date(), (numDays) - 0),
        end: new Date(),
    });
    // formatCurrency()
    const data = allDates.map((date) => {
        const totalSales = bookings
            ?.filter((booking: any) => isSameDay(date, new Date(booking.created_at)))
            ?.reduce((acc: any, cur: any) => acc + cur.total_price, 0);
    
        const totalExpenses = storage
            ?.filter((items: any) => isSameDay(date, new Date(items.created_at)))
            ?.reduce((acc: any, cur: any) => acc + cur.sum, 0);
    
        const totalInOut = totalSales - totalExpenses;
    
        return {
            label: format(date, "MMM dd"),
            totalSales: totalSales,
            TotalExpenses: totalExpenses,
            TotalInOut: totalInOut,
        };
    });
    
    const colors = isDarkMode
        ? {
              totalSales: {
                  stroke: "green",
                  fill: "green",
              },
              TotalExpenses: { 
                stroke: "red", 
                fill: "red" 
            },
              TotalInOut: {
                  stroke: "var(--color-brand-600)",
                  fill: "var(--color-brand-200)",
              },
              text: "#e5e7eb",
              background: "#18212f",
          }
        : {
              totalSales: {
                //   stroke: "var(--color-brand-600)",
                //   fill: "var(--color-brand-200)",
                stroke: "green",
                fill: "green",
              },
              TotalExpenses: { 
                // stroke: "#16a34a",
                //  fill: "#dcfce7" 
                stroke: "red", 
                fill: "red" 
                },
              TotalInOut: {
                  stroke: "blue",
                  fill: "lightblue",
              },
              text: "#374151",
              background: "#fff",
          };
    return (
        <StyledSalesChart>
            <Heading as="h2">
                {Language==="en"?`Sales/Expenses from `:` مبيعات/المصاريف من`}{" "} {format(allDates.at(Language==="en"?0:-1) as any, "MMM dd yyyy")}{" "}
                &mdash; {format(allDates.at(Language==="en"?-1:0) as any, "MMM dd yyyy")}{" "}
            </Heading>

            <ResponsiveContainer height={300} width="100%">
                <AreaChart data={data}>
                    <XAxis
                        dataKey="label"
                        tick={{ fill: colors.text }}
                        tickLine={{ stroke: colors.text }}
                    />
                    <YAxis
                        unit=""
                        tick={{ fill: colors.text }}
                        tickLine={{ stroke: colors.text }}
                    />
                    <CartesianGrid strokeDasharray="4" />
                    <Tooltip
                        contentStyle={{ backgroundColor: colors.background }}
                    />
                    <Area
                        dataKey="totalSales"
                        type="monotone"
                        stroke={colors.totalSales.stroke}
                        fill={colors.totalSales.fill}
                        strokeWidth={2}
                        name={Language==="en"?"Total Revenue From Bookings":"اجمالي الايرادات من الحجوزات"}
                        unit="£E"
                    />
                    <Area
                        dataKey="TotalExpenses"
                        type="monotone"
                        stroke={colors.TotalExpenses.stroke}
                        fill={colors.TotalExpenses.fill}
                        strokeWidth={2}
                        name={Language==="en"?"Total expenses From Storage":"اجمالي المصاريف من المخزن"}
                        unit="£E"
                    />
                    <Area
                        dataKey="TotalInOut"
                        type="monotone"
                        stroke={colors.TotalInOut.stroke}
                        fill={colors.TotalInOut.fill}
                        strokeWidth={2}
                        name={Language==="en"?"Total In/Out":"محصلة الربح"}
                        unit="£E"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </StyledSalesChart>
    );
}

export default SalesChart;
