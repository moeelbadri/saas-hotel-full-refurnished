"use client";
import styled from "styled-components";

const StyledDataItem = styled.div`
    display: flex;
    align-items: center;
    gap: 1.6rem;
    padding: 0.8rem 0;
    margin: 0.8rem 0;
`;

const Label = styled.span`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-weight: 500;
    /* ← add these two: */
    flex-wrap: nowrap;
    white-space: nowrap;

    & svg {
        width: 2rem;
        height: 2rem;
        color: var(--color-brand-600);
    }
    `;

function DataItem({ icon, label, children }: any) {
    return (
        <StyledDataItem>
            <Label>
                {icon}
                <span>{label}</span>
                {children}

            </Label>
        </StyledDataItem>
    );
}

export default DataItem;
