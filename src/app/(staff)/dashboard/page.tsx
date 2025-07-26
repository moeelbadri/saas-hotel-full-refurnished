"use client";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { Row } from "@/components/layout";
import { DashboardFilter, DashboardLayout } from "@/features/dashboard";
import styled from "styled-components";

const Stacked = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    & span:first-child {
        font-weight: 600;
        font-size: 3.5rem;
    }

    & span:last-child {
        color: var(--color-grey-500);
        font-size: 1.6rem;
    }
`;
export default function Dashboard() {
    const Language = useSettingsStore(state => state.Language);
    return (
        <>
            <Row>
                {/* <Heading as="h1">Dashboard</Heading> */}
                <Stacked style={{marginBottom:"25px"}}>
                {Language==="en"
                    ?<><span>Dashboard</span><span>*(values) : Total calculation with non-booked reservations</span></>
                    :<><span>لوحة التحكم</span><span>*(القيم) : اجمالي الحسابات مع الحجوزات الغير مؤكدة</span></>
                }</Stacked> 
                <DashboardFilter />
            </Row>
            <DashboardLayout />
        </>
    );
}