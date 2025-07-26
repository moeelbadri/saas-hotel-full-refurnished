"use client";
import styled from "styled-components";
import { Button} from "@/components/ui";
import { Heading } from "@/components/typography";
import { Form, FormRow, Input } from "../form";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSettingsStore } from "@/components/WizardForm/useStore";
const StyledConfirmDelete = styled.div`
    width: 30rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    & p {
        color: var(--color-grey-500);
        margin-bottom: 5.2rem;
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
    resourceName: string;
    resourceQty:number;
    onConfirm: (data: { amount: number; description: string }) => void;
    disabled: boolean;
    onCloseModal?: () => void;
    isLoading?: boolean;
    promise?: Promise<unknown>;
};

function ConfirmConsumption({
    resourceName,
    resourceQty,
    onConfirm,
    disabled,
    onCloseModal,
    isLoading = false,
    promise,
}: Props) {
        const {
            register,
            handleSubmit,
            reset,
            formState,
        } = useForm<any>({
            // defaultValues: isEditSession ? editValues : {},
        });
        const Language = useSettingsStore(state => state.Language);
        const { errors } = formState;
        const onSubmit = (data: any) => {
            onConfirm(data);
        }
        function onError(errors: any) {
            errors;
        }
    const setIsOpenned = useSettingsStore((state) => state.setIsOpenned);
    useEffect(() => {
    if (promise != null && typeof promise.then === 'function') {
        promise?.then(() =>{
            setIsOpenned(false);
            onCloseModal?.();
        });
    }
    },[promise])
    return (
        <StyledConfirmDelete>
            <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        type={onCloseModal ? "modal" : "regular"}
        iswidestring={"false"}
        >
        <Heading as="h3">{Language==="en"?"Confirm Consumption of":"تأكيد استهلاك"}  {resourceName}</Heading>
            <FormRow
            label={Language==="en"?"Amount":"الكمية"}
            error={errors?.quantity?.message as string}
            >
              <Input
                    type="number"
                    id="quantity"
                    {...register("quantity", {
                        required: "This field is required",
                        validate: (value) => value < Number(resourceQty) || "invalid amount",
                    })}
                />
            </FormRow>
            <FormRow
            label={Language==="en"?"Reason":"السبب"}
            >
              <Input
                    type="text"
                    id="Description"
                    {...register("description", {
                        required: "This field is required",
                    })}
                />
            </FormRow>
            <div>
                <Button 
                    variant="secondary"
                    disabled={disabled}
                    type="reset"
                    onClick={() => onCloseModal?.()}
                >
                    {Language==="en"?"Cancel":"الغاء"}
                </Button>
                <Button
                    variant="primary"
                    disabled={disabled}
                    type="submit"
                    onClick={() => {
                        setTimeout(() => {
                    }, 1000);}}
                >
                    {Language==="en"?"Confirm":"تأكيد"}
                </Button>
            </div>
            </Form>
        </StyledConfirmDelete>
    );
}

export default ConfirmConsumption;
