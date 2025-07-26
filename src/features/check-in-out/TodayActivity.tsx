"use client";
import styled from "styled-components";

import TodayItem from "./TodayItem";
import { Row } from "@/components/layout";
import { useTodayActivity } from "@/hooks/check-in-out";
import { Heading } from "@/components/typography";
import { Spinner } from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const StyledToday = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);

    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
    grid-column: 3 / span 2;
    padding-top: 2.4rem;
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

function TodayActivity() {
    const { activities, isLoading } = useTodayActivity();
    const Language = useSettingsStore(state => state.Language);
    return (
        <StyledToday>
            <Row>
                <Heading as="h2">{Language==="en"?"Today":"اليوم"}</Heading>
            </Row>
            
            {!isLoading ? (
                (activities?.data?.bookings?.length as number) > 0 ? (
                    <TodayList>
                        {activities?.data?.bookings?.map((activity) => (
                            <TodayItem activity={activity} key={activity.id} />
                        ))}
                    </TodayList>
                ) : (
                    <NoActivity>{Language==="en"?"No activity":"لا يوجد نشاط"}</NoActivity>
                )
            ) : (
                <Spinner />
            )}
        </StyledToday>
    );
}

export default TodayActivity;
