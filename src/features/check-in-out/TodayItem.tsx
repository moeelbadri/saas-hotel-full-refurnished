"use client";
import styled from "styled-components";
import Link from "next/link";
import { Button, Flag, Tag } from "@/components/ui";
import CheckoutButton from "./CheckoutButton";

const StyledTodayItem = styled.li`
    display: flex;    
    gap: 1.2rem;
    justify-content: space-between;
    align-items: center;

    font-size: 1.4rem;
    padding: 0.8rem 0;
    border-bottom: 1px solid var(--color-grey-100);

    &:first-child {
        border-top: 1px solid var(--color-grey-100);
    }
`;

const Guest = styled.div`
    font-weight: 500;
`;
function getDaysDiff(end:Date, start:Date){
    return  Math.round(((new Date(end).getTime()) - (new Date(start).getTime())) / (1000 * 60 * 60 * 24));
}
function TodayItem({ activity }: any) {
    const { id,check_in,check_out, full_name, country_flag, nationality, end_date,start_date } = activity;
    console.log(activity)
    const status = check_in ? (check_out ? "Leaving" : "Arriving"): "Leaving";
    return (
        <StyledTodayItem>
            {status === "Arriving" && <Tag type="green">Arri`ving</Tag>}
            {status === "Leaving" && <Tag type="blue">Leaving</Tag>}

            <Flag src={country_flag} alt={`Flag of ${nationality}`} />
            <Guest>{full_name}</Guest>
            <div>{getDaysDiff(new Date(end_date),new Date(start_date))} nights</div>
 
            {status === "Arriving" && (
                <Button
                    size="small"
                    variant="primary"
                    as={Link}
                    href={`/checkin/${id}`}
                >
                    Check in
                </Button>
            )}
            {status === "Leaving" && <CheckoutButton bookingId={id} />}
        </StyledTodayItem>
    );
}

export default TodayItem;
