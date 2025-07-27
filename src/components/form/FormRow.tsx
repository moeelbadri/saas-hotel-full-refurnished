"use client";
import styled from "styled-components";

const StyledFormRow = styled.div<{ displayType?: string }>`
    display: ${({ displayType }) => displayType || 'grid'};
    align-items: center;
    grid-template-columns: 24rem 1.5fr 1.0fr;
    gap: 2.4rem;
    flex-wrap: nowrap;
    white-space: nowrap;
    padding: 1.2rem 0;

    &:first-child {
        padding-top: 0;
    }

    &:last-child {
        padding-bottom: 0;
    }

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }

    &:has(button) {
        display: flex;
        justify-content: flex-end;
        gap: 1.2rem;
    }


    @media (max-width: 1200px) {
        display: ${({ displayType }) => displayType === 'flex' ? 'flex' : 'grid'};
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1.5rem 0;
        text-align: left;
        /* Applies to any element that has a checkbox, EXCEPT if it has the "excluded" class */
        &:has(input[type="checkbox"]):not(:has(table)) {
        display: grid;
        align-items: center;
        grid-template-columns: 20rem 1.5fr 1.0fr;
        gap: 4.4rem;
        }
    }

    @media (max-width: 480px) {
        gap: 0.8rem;
        padding: 1.2rem 0;

        &:has(button) {
            gap: 0.8rem;
        }
    }
`;

const Label = styled.label`
    font-weight: 500;

    @media (max-width: 768px) {
        margin-bottom: 0.5rem;
        display: block;
    }
`;

const Error = styled.span`
    font-size: 1.4rem;
    color: var(--color-red-700);

    @media (max-width: 1200px) {
        font-size: 1.3rem;
    }

    @media (max-width: 768px) {
        font-size: 1.2rem;
        margin-top: 0.5rem;
        display: block;
    }
`;

type FormRowProps = {
    label?: string;
    error?: string | undefined;
    displayType?: string;
    children: React.ReactNode;
    ref ?: any;
};

function FormRow({ label, error, displayType, children, ref }: FormRowProps) {
    return (
        <StyledFormRow displayType={displayType} ref={ref}>
            {label && <Label>{label}</Label>}
            {children}
            {error && <Error>{error}</Error>}
        </StyledFormRow>
    );
}

export default FormRow;
