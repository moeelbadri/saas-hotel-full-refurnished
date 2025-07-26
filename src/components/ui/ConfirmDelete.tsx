"use client";
import styled from "styled-components";
import { Button, SpinnerMini } from "@/components/ui";
import { Heading } from "@/components/typography";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useSettingsStore } from "../WizardForm/useStore";

const StyledConfirmDelete = styled.div`
    width: 40rem;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    & p {
        color: var(--color-grey-500);
        margin-bottom: 1.2rem;
    }

    & div {
        display: flex;
        justify-content: flex-end;
        gap: 1.2rem;
    }
`;

type Props = {
    resourceName: string;
    onConfirm: () => void;
    disabled: boolean;
    Language?:string;
    isLoading?: boolean;
    onCloseModal?: () => void;
    promise: Promise<unknown>;
};
function ConfirmDelete({
    resourceName,
    Language,
    onConfirm,
    disabled,
    isLoading,
    onCloseModal,
    promise,
}: Props) {
     const { t } = useTranslation();
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
        <StyledConfirmDelete>
            {Language==="en"?
            <Heading as="h3">Delete {t(resourceName)}</Heading>
            :
            <Heading as="h3">حذف {t(resourceName)}</Heading>}
            {Language==="en"?
            <p>
                Are you sure you want to delete this {t(resourceName)} permanently?
                This action cannot be undone.
            </p>
            :
            <p>
                هل أنت متأكد أنك تريد حذف  {t(resourceName)} بشكل دائم؟
                هذا الإجراء لا يمكن التراجع عنه.
            </p>}
            <div>
                <Button
                    variant="secondary"
                    disabled={disabled}
                    onClick={() => onCloseModal?.()}
                >
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    disabled={disabled}
                    onClick={onConfirm}
                >   
                    {Language==="en"?"Delete":"حذف"}
                </Button>
            </div>
        </StyledConfirmDelete>
    );
}

export default ConfirmDelete;
