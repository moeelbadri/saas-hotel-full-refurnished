"use client";
import styled from "styled-components";

import { Spinner } from "@/components/ui";

import {useGetStorageReportsWithUsers} from "@/hooks/reports";
import SalesChart from "./SalesChart";
import ReportsTable from "./ReportsTable";


const StyledDashboardLayout = styled.div`
    margin: 2.3rem auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: auto 34rem auto;
    gap: 2.4rem;
`;

function ReportsLayout() {
    return (
         <>
        <div style={{ height: "3rem" }}></div>
        <ReportsTable/>
        <StyledDashboardLayout>
        <SalesChart />
        </StyledDashboardLayout>
         </>
    );
}

export default ReportsLayout;
