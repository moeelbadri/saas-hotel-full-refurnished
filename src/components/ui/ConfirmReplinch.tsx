"use client";
import styled from "styled-components";
import { Button, SpinnerMini} from "@/components/ui";
import { Heading } from "@/components/typography";
import { Input, Form, FileInput, Textarea, FormRow } from "@/components/form";
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
    resourceName: string;
    onConfirm: (data: { amount: number; totalCost: number; description: string }) => void;
    disabled: boolean;
    onCloseModal?: () => void;
    isLoading?: boolean;
    promise?: Promise<unknown>;
};


function ConfirmReplinch({
    resourceName,
    onConfirm,
    disabled,
    onCloseModal,
    isLoading,
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
        const { errors } = formState

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
        onSubmit={handleSubmit(onConfirm, onError)}
        type={onCloseModal ? "modal" : "regular"}
        iswidestring={"false"}
        >
        <Heading as="h3">{Language === "en" ? "Confirm Replinching of":"تأكيد الاضافة"} {resourceName}</Heading>
            <FormRow
            label={Language === "en" ? "Amount" : "الكمية"}
            // error={errors.Ammount?.message}
            >
              <Input
                    type="number"
                    id="Amount"
                    {...register("quantity", {
                        required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow
            label={Language === "en" ? "Total Cost" : "التكلفة الكلية"}
            // error={errors["Total Cost"]?.message}
            >
              <Input
                    type="number"
                    id="Total Cost"
                    {...register("total_cost", {
                        required: "This field is required",
                    })}
                />
            </FormRow>
            <FormRow
            label={Language === "en" ? "Reason" : "السبب"}
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
                    {Language === "en" ? "Cancel" : "الغاء"}
                </Button>
                <Button
                    variant="primary"
                    disabled={disabled}
                    type="submit"
                >
                   {isLoading ? <SpinnerMini /> : Language === "en" ? "Confirm" : "تأكيد"}
                </Button>
            </div>
            </Form>
        </StyledConfirmDelete>
    );
}

export default ConfirmReplinch;
