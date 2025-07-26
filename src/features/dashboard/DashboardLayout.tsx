"use client";
import styled from "styled-components";

import { Spinner } from "@/components/ui";

import { useRecentBookings, useRecentStays } from "@/hooks/bookings";
import { useCabins } from "@/hooks/cabins";

import Statistics from "./Statistics";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import Alerts from "./Alerts";
import { TodayActivity } from "../check-in-out";
import DashboardBox from "./DashboardBox";
import CriticalItems from "../Storage/CriticalItems";
import {useGetTotalStorageExpenses} from "@/hooks/reports";
import { useGetProfile } from "@/hooks/authentication";
import { useGetDashboardStats } from "@/hooks/statistics";
import Messages from "./Messages";

import { HiSpeakerphone } from "react-icons/hi";
import Announcements from "./Announcements";

const StyledDashboardLayout = styled.div`
    margin: 2.5rem auto;
    grid-template-columns: 1fr 1fr 1fr 1fr ;
    grid-template-rows: auto auto auto ;
    gap: 2.4rem;
    padding: 2.4rem;
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);
    overflow: auto;
    display: grid;


    @media (max-width: 1200px) {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        overflow-x: auto;
        gap: 2rem;
        margin: 2rem auto;
    }

    @media (max-width: 768px) {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        overflow-x: auto;
        gap: 1.5rem;
        margin: 1.5rem auto;
    }

    @media (max-width: 480px) {
        margin: 1rem auto;
        gap: 1rem;
    }
`;
function DashboardLayout() {
    const { data, isLoading: isLoading1 } = useGetDashboardStats();
    const {owner,permissions,isLoading: isLoading5} = useGetProfile();
    const isLoading = isLoading1 || isLoading5;
    return (
        <>  
        <StyledDashboardLayout>
            {(permissions?.StatisticsRead || owner) && <Statistics isLoading={isLoading} stats={data?.data.statistics?.[0]!}/>}
            {(permissions|| owner) && <Announcements />}    
            {(permissions?.StorageRead || owner) && <Messages />}
            {(permissions) && <Alerts />}
            {(permissions?.StorageRead || owner) && <CriticalItems />}
            {(permissions?.BookingRead ) && <TodayActivity />}
            {(owner)&&<DurationChart isLoading={isLoading} column={permissions?.BookingRead?1:3} occupancy={data?.data.statistics[0].stay_duration_distribution} />}
            {/* {(owner) &&<SalesChart storage={StorageReportsSum.data.reports} bookings={bookings?.data.bookings} numDays={numDays} />}  */}
                      
        </StyledDashboardLayout>
        </>
    );
}

export default DashboardLayout;
