"use client";
import styled from "styled-components";

import CriticalItem from "./CriticalItem";
import { Row } from "@/components/layout";
import { useGetItemsAtCritical } from "@/hooks/storage";
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
    gap: 2.2rem;
        flex-direction: column;
    grid-column: 1 / span 2;
    padding-top: 2.4rem;
`;

const TodayList = styled.ul`
    overflow: auto;
    overflow-x: hidden; 


    // /* Removing scrollbars for webkit, firefox, and ms, respectively */
    // &::-webkit-scrollbar {
    //     width: 0 !important;
    // }
    scrollbar-width: 5px;
    -ms-overflow-style: none;
`;

const NoActivity = styled.p`
    text-align: center;
    font-size: 1.8rem;
    font-weight: 500;
    margin-top: 0.8rem;
`;

function CriticalItems() {
    const { StorageItems,error, isLoading } = useGetItemsAtCritical();
    const Language = useSettingsStore(state => state.Language);
    return (
        <StyledToday>
            <Row>
                <Heading as="h2">{Language==="en"?"Storage State":"حالة المخزن"}</Heading>
            </Row>
             {isLoading ? <Spinner /> : (StorageItems?.data.storage && StorageItems?.data.storage.length  > 0 ? (
                    <TodayList>
                        {StorageItems?.data.storage.map((item:any) => (
                            <CriticalItem item={item} key={item.id} />
                        ))}
                    </TodayList>
                ) : (
                    <NoActivity>{Language==="en"?"Storage Items quantities at good state!":"لا يوجد عناصر تحتاج الى اعادة تعبئة"} </NoActivity>
                ))}
           
        </StyledToday>
    );
}

export default CriticalItems;
