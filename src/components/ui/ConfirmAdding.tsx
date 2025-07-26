"use client";
import styled from "styled-components";
import { Button, SpinnerMini } from "@/components/ui";
import { Heading } from "@/components/typography";
import { formatCurrency } from "@/utils/helpers";
import { FormRow, Input } from "../form";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import toast from "react-hot-toast";
import { useGetAvailableDiscount } from "@/hooks/discounts";
import { useGetPickedAmenities } from "@/hooks/settings";
import { useGetCabinAvailability } from "@/hooks/cabins";
import {useSettings} from "@/hooks/settings"
const StyledConfirmPayment = styled.div`
   width: 30rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    & p {
        color: var(--color-grey-500);
        margin-bottom: 1.2rem;
    }

    & div {
        display: flex;
        justify-content: space-between;
        gap: 1.2rem;
    }
    
    & h3 {
    text-align: center;
    }
`;

type Props = {
    resourceName: any;
    ConfirmationMessage?: string;
    onConfirm: (id:any,totalCost:any,pickedDay:any) => void;
    disabled: boolean;
    onCloseModal?: () => void;
    promise?: Promise<unknown>;
};

export default function ConfirmAdding({
    resourceName,
    ConfirmationMessage,
    onConfirm,
    disabled,
    onCloseModal,
    promise,
}: Props) {
    const Language = useSettingsStore(state => state.Language);
    const setIsOpenned = useSettingsStore((state) => state.setIsOpenned);
    const {settings} = useSettings();
    const newDate = new Date(resourceName.end_date);
    const EndDate = new Date(resourceName.end_date);
    newDate.setDate(newDate.getDate() + 30);
    EndDate.setDate(EndDate.getDate() + 1);
    const nextdays = newDate.toISOString().split("T")[0];
    const Endday = EndDate.toISOString().split("T")[0];
    const {discounts,error:errorDiscount,isLoading:isLoadingDiscount}=useGetAvailableDiscount();
    const {data,isLoading,error} = useGetCabinAvailability(resourceName.bookingCabins[0].cabinID,Endday,nextdays,discounts);
    const [pickedDay, setPickedDays] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    useEffect(() => {
    if (promise != null && typeof promise.then === 'function') {
        promise?.then(() =>{
            setIsOpenned(false);
            onCloseModal?.();
        });
    }
    },[promise])
    useEffect(() => {
        let temp=0;
        for(let i = 0; i <= pickedDay; i++){
            temp+=(data?.[i]?.regularprice??0)
        }
        setTotalCost(temp*((100+settings!.data!.settings!.vat)/100))
    },[pickedDay])
    // const { isgettingPicked, GetPickedAmenities } = useGetPickedAmenities(dayDiff,discounts,startdate,enddate);
    if(isLoadingDiscount||isLoading) return <SpinnerMini/>
    return (
        <StyledConfirmPayment>
            <Heading as="h3" style={{ textAlign: "center" }}>Extend Booking</Heading>
            {ConfirmationMessage ? <p>{ConfirmationMessage}</p>:
        <>
        {(data?.length??0)>0?
        <p>
            You are about to extend {" "} booking #{resourceName.id} to
            <select onChange={(e) => setPickedDays(Number(e.target.selectedIndex))} style={{color: "black"}}>{data?.map((item:any) => <option id={item.date}>{item.date}</option>)}</select>
            {resourceName.BookingId} for {formatCurrency(totalCost)}
        </p>
         : <strong> No Available Days </strong>}
        </>

}            
            <div>
                <Button
                    variant="secondary"
                    disabled={disabled}
                    onClick={() => onCloseModal?.()}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    disabled={disabled}
                    onClick={()=>onConfirm(resourceName.id,totalCost,data?.[pickedDay].date)}
                >
                    Confirm
                </Button>
            </div>
        </StyledConfirmPayment>
    );
}
