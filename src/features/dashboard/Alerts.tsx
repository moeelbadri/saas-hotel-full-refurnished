"use client";
import styled from "styled-components";

import Alert from "./AlertRow";
import { Row } from "@/components/layout";
import { useGetAlerts } from "@/hooks/settings";
import { Heading } from "@/components/typography";
import { Button, Spinner } from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import {AddAlert} from "@/features/Alerts"
const StyledToday = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
    padding-top: 2.4rem;
    grid-column: 3 / span 2;
`;

const TodayList = styled.ul`
    overflow: auto;
    overflow-x: hidden;

    // /* Removing scrollbars for webkit, firefox, and ms, respectively */
    // &::-webkit-scrollbar {
    //     width: 0 !important;
    // }
    scrollbar-width: none;
    -ms-overflow-style: none;
`;

const NoActivity = styled.p`
    text-align: center;
    font-size: 1.8rem;
    font-weight: 500;
    margin-top: 0.8rem;
`;


function Alerts() {
    const { GetAlerts, isgettingAlerts} = useGetAlerts();

    const Language = useSettingsStore(state => state.Language);
    
    return (
        <StyledToday>
            <Row direction="row">
                <Heading as="h2">{Language==="en"?"Notes / Alerts":"الملاحظات / التنبيهات"}</Heading>
                <AddAlert/>
            </Row>
            
            {!isgettingAlerts ? (
                (GetAlerts?.data?.alerts.length as number) > 0 ? (
                    <TodayList>
                        {GetAlerts?.data.alerts.map((alert: any) => (
                            <Alert Alert={alert} key={alert.id} />
                        ))}
                    </TodayList>
                ) : (
                    <NoActivity>{Language==="en"?"No Alerts":"لا يوجد تنبيهات"}</NoActivity>
                )
            ) : (
                <Spinner />
            )}
        </StyledToday>
    );
}

export default Alerts;
