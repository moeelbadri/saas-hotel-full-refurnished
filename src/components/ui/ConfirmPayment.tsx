"use client";
import styled from "styled-components";
import { Button, SpinnerMini } from "@/components/ui";
import { Heading } from "@/components/typography";
import { formatCurrency } from "@/utils/helpers";
import { FormRow, Input } from "../form";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import toast from "react-hot-toast";

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
    resourceName: {
        full_name: string;
        total_price: number;
    };
    ConfirmationMessage?: string;
    onConfirm: (Value:number, info:string) => void;
    disabled: boolean;
    fixed: boolean;
    isLoading: boolean;
    onCloseModal?: () => void;
    promise: Promise<unknown>;
};

export default function ConfirmPayment({
    resourceName,
    ConfirmationMessage,
    onConfirm,
    disabled,
    fixed,
    isLoading,
    onCloseModal,
    promise,
}: Props) {
    const abs = Math.abs(resourceName.total_price);
    const [value, setValue] = useState(abs);
    const [info , setInfo] = useState("");
    const Language = useSettingsStore(state => state.Language);
    const setIsOpenned = useSettingsStore((state) => state.setIsOpenned);
    useEffect(() => {
    if (promise != null && typeof promise.then === 'function') {
        promise?.then(() =>{
            setIsOpenned(false);
            onCloseModal?.();
        });
    }
    },[promise])
    if (isLoading) return <SpinnerMini />;
    return (
        <StyledConfirmPayment>
            <Heading as="h3">Payment Confirmation</Heading>
        {ConfirmationMessage ? <p>{ConfirmationMessage}</p>:<>
        <p>
            {Language ==="en" ? `Are you sure That ${resourceName.full_name} paying ${fixed ? formatCurrency(abs): ""}` : `هل انت متاكد من ${resourceName.full_name} قام بدفع المبلغ الاتي  ${fixed ? formatCurrency(abs):""} ؟ `}
        </p>
        {!fixed && 
        <FormRow label="Amount (EGP)">
        <Input type="number" style={{width:"100%"}} value={value} max={value} onChange={(e)=>setValue(Number(e.target.value))}></Input>
        </FormRow>
        }
        <FormRow label="information">
       <Input type="text" style={{width:"100%"}} value={info} onChange={(e)=>setInfo(e.target.value)}></Input>
        </FormRow>
        </>}            
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
                    onClick={()=>{
                        if(value>abs){
                            toast.error("Please Enter Valid Amount <= "+ abs);
                        }else{
                            onConfirm(value,info);
                        }
                    }}
                >
                    Confirm
                </Button>
            </div>
        </StyledConfirmPayment>
    );
}
