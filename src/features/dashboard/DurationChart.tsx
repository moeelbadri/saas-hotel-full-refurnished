"use client";
import { useState, useRef, useMemo } from "react";
import styled from "styled-components";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import { Heading } from "@/components/typography";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { Spinner } from "@/components/ui";
import React from "react";

const ChartBox = styled.div<{ column: number }>`
  position: relative;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 3.2rem;
  grid-column: ${({ column }) => `${column} / span 2`};

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }

  @media (max-width: 1200px) {
    padding: 2rem 2.5rem;
    grid-column: 1 / -1;
    
    & > *:first-child {
      margin-bottom: 1.4rem;
    }
  }

  @media (max-width: 768px) {
    padding: 1.8rem 2rem;
    border-radius: var(--border-radius-sm);
    
    & > *:first-child {
      margin-bottom: 1.2rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 0 -0.5rem;
    border-left: none;
    border-right: none;
    border-radius: 0;
    
    & > *:first-child {
      margin-bottom: 1rem;
    }
  }
`;


const startDataLight = [
    {
        duration: "1 day",
        value: 0,
        color: "#ff4444",
    },
    {
        duration: "2 days",
        value: 0,
        color: "#ff7316",
    },
    {
        duration: "3 days",
        value: 0,
        color: "#fab308",
    },
    {
        duration: "4-5 days",
        value: 0,
        color: "#94cc16",
    },
    {
        duration: "6-7 days",
        value: 0,
        color: "#fe06e5",
    },
    {
        duration: "8-14 days",
        value: 0,
        color: "#16c7b3",
    },
    {
        duration: "15-21 days",
        value: 0,
        color: "#4f8ff7",
    },
    {
        duration: "21+ days",
        value: 0,
        color: "#924fd0",
    },
];

/*

const startDataDark = [
    {
        duration: "1 day",
        value: 0,
        color: "#b91c1c",
    },
    {
        duration: "2 days",
        value: 0,
        color: "#c2410c",
    },
    {
        duration: "3 days",
        value: 0,
        color: "#a16207",
    },
    {
        duration: "4-5 days",
        value: 0,
        color: "#4d7c0f",
    },
    {
        duration: "6-7 days",
        value: 0,
        color: "#15803d",
    },
    {
        duration: "8-14 days",
        value: 0,
        color: "#0f766e",
    },
    {
        duration: "15-21 days",
        value: 0,
        color: "#1d4ed8",
    },
    {
        duration: "21+ days",
        value: 0,
        color: "#7e22ce",
    },
];
*/

function prepareData(startData: any, stays: any[]) {
    function incArrayValue(arr: any[], field: string, amount: any) {
        return arr.map((obj: { duration: any; value: any; }) => 
            obj.duration === field ? { ...obj, value: obj.value + amount } : obj
        );
    }

    const data = stays
        ?.reduce((arr: any, cur: { stay_duration_days: any; frequency: any; }) => {
            const num = cur.stay_duration_days;
            const freq = cur.frequency;
            
            if (num === 1) return incArrayValue(arr, "1 day", freq);
            if (num === 2) return incArrayValue(arr, "2 days", freq);
            if (num === 3) return incArrayValue(arr, "3 days", freq);
            if ([4, 5].includes(num)) return incArrayValue(arr, "4-5 days", freq);
            if ([6, 7].includes(num)) return incArrayValue(arr, "6-7 days", freq);
            if (num >= 8 && num <= 14) return incArrayValue(arr, "8-14 days", freq);
            if (num >= 15 && num <= 21) return incArrayValue(arr, "15-21 days", freq);
            if (num >= 22) return incArrayValue(arr, "21+ days", freq);
            return arr;
        }, startData)
        .filter((obj: { value: number; }) => obj.value > 0);

    return data;
}
export default function DurationChart({
  occupancy,
  column,
  isLoading,
}: any) {
  const Language = useSettingsStore(state => state.Language);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Memoize data so it only recomputes when occupancy actually changes
  const data = useMemo(
    () => prepareData(startDataLight, occupancy),
    [occupancy]
  );
  // If there's no real data, show a single "No data" slice in grey
  const chartData = useMemo(() => {
    if (data?.length > 0) return data;
    return [{
      duration: Language === "en" ? "No data" : "لا يوجد بيانات",
      value: 1,
      // any neutral grey you like
      color: "var(--color-grey-800)",
    }];
  }, [data, Language]);
  // Move tooltip by updating its style directly
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tooltipRef.current) return;
    const { offsetX, offsetY } = e.nativeEvent;
    tooltipRef.current.style.left = `${offsetX - 45}px`;
    tooltipRef.current.style.top = `${offsetY - 36}px`;
  };
  const onMouseLeave = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `-9999px`;
    }
  };
const MemoizedPieChart = React.memo(function MemoizedPieChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={240} style={{ direction: "ltr"}}>
      <PieChart>
        <Tooltip content={<CustomTooltip />} cursor={false}/>
         <Pie
            data={data}
            nameKey="duration"
            dataKey="value"
            innerRadius={85}
            outerRadius={110}
            cx="55%"
            cy="50%"
          >
            {data.map((entry: any) => (
              <Cell key={entry.duration} fill={entry.color} stroke={entry.color} />
            ))}
          </Pie>
          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            iconSize={15}
            iconType="circle"
          />
      </PieChart>
    </ResponsiveContainer>
  );
});
  // A tooltip container that lives in the DOM but is never part of React state
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0];
    return (
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          pointerEvents: "none",
          background: "rgba(0,0,0,0.85)",
          color: "#fff",
          borderRadius: 22,
          padding: "0.4rem 0.8rem",
          fontSize: "1.4rem",
          whiteSpace: "nowrap",
          // start off-screen
          left: "-9999px",
        }}
      >
        {`${name}: ${value}`}
      </div>
    );
  };

  if (isLoading)
    return (
      <ChartBox column={column}>
        <Spinner />
      </ChartBox>
    );

  return (
    <ChartBox
      column={column}
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <Heading as="h2">
        {Language === "en" ? "Stay Duration Summary" : "ملخص مدة الحجز"}
      </Heading>

      <ResponsiveContainer width="100%" height={240}>
       <MemoizedPieChart data={chartData} />
      </ResponsiveContainer>
    </ChartBox>
  );
}

