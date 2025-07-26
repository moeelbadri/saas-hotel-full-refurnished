"use client";
import { SpinnerMini } from "@/components/ui";
import styled from "styled-components";

const StyledStat = styled.div`
    /* Box */
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);

    padding: 1.6rem;
    display: grid;
    grid-template-columns: 6.4rem 1fr;
    grid-template-rows: auto auto;
    column-gap: 1.6rem;
    row-gap: 0.4rem;
    // max-width:300px
    // min-width:300px

    @media (min-width: 120px) {
        margin-bottom: 1rem;
    }

    @media (max-width: 1200px) {
        padding: 1.4rem;
        grid-template-columns: 5.6rem 1fr;
        column-gap: 1.4rem;
    }

    @media (max-width: 768px) {
        padding: 1.2rem;
        grid-template-columns: 4.8rem 1fr;
        column-gap: 1.2rem;
        margin-bottom: 0.8rem;
    }

    @media (max-width: 480px) {
        padding: 1rem;
        grid-template-columns: 4rem 1fr;
        column-gap: 1rem;
        margin-bottom: 0.5rem;
    }
`;

const Icon = styled.div`
    grid-row: 1 / -1;
    aspect-ratio: 1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    /* Make these dynamic, based on the received prop */
    background-color: var(--color-${(props) => props.color}-100);

    & svg {
        width: 3.2rem;
        height: 3.2rem;
        color: var(--color-${(props) => props.color}-700);
    }

    @media (max-width: 1200px) {
        & svg {
            width: 2.8rem;
            height: 2.8rem;
        }
    }

    @media (max-width: 768px) {
        & svg {
            width: 2.4rem;
            height: 2.4rem;
        }
    }

    @media (max-width: 480px) {
        & svg {
            width: 2rem;
            height: 2rem;
        }
    }
`;

const Title = styled.h5`
    align-self: end;
    font-size: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-weight: 600;
    color: var(--color-grey-500);

    @media (max-width: 1200px) {
        font-size: 1.4rem;
    }

    @media (max-width: 768px) {
        font-size: 1.3rem;
        letter-spacing: 0.2px;
    }

    @media (max-width: 480px) {
        font-size: 1.2rem;
    }
`;

const Value = styled.p`
    font-size: 2.4rem;
    line-height: 1;
    font-weight: 500;

    @media (max-width: 1200px) {
        font-size: 2.2rem;
    }

    @media (max-width: 768px) {
        font-size: 2rem;
    }

    @media (max-width: 480px) {
        font-size: 1.8rem;
    }
`;

function Stat({ icon, title, value, color, isLoading }: any) {
    return (
        <StyledStat>
            <Icon color={color}>{icon}</Icon>
            <Title>{title}</Title>
            {isLoading ? <SpinnerMini /> : <Value>{value}</Value>} 
        </StyledStat>
    );
}

export default Stat;
