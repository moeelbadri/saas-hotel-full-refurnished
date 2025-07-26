"use client";
import styled from "styled-components";

const DashboardBox = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);

    padding: 3.2rem;

    display: flex;
    flex-direction: column;
    gap: 2.4rem;

    @media (max-width: 1200px) {
        padding: 2.8rem;
        gap: 2rem;
    }

    @media (max-width: 768px) {
        padding: 2.4rem;
        gap: 1.8rem;
        border-radius: var(--border-radius-sm);
    }

    @media (max-width: 480px) {
        padding: 2rem;
        gap: 1.5rem;
        margin: 0 -0.5rem;
        border-left: none;
        border-right: none;
        border-radius: 0;
    }
`;

export default DashboardBox;
