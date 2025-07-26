"use client";
import styled from "styled-components";

const Input = styled.input`
    border: 1px solid var(--color-grey-300);
    background-color: var(--color-grey-0);
    border-radius: var(--border-radius-sm);
    padding: 0.8rem 0;
    box-shadow: var(--shadow-sm);

    @media (max-width: 1200px) {
        padding: 1rem 1.4rem;
        font-size: 1.4rem;
    }

    @media (max-width: 768px) {
        padding: 1.2rem 1.6rem;
        font-size: 1.6rem;
        min-height: 4.4rem; /* Better touch target */
        border-radius: var(--border-radius-md);
    }

    @media (max-width: 480px) {
        padding: 1.4rem 1.8rem;
        font-size: 1.6rem;
        min-height: 4.8rem; /* Even better touch target */
        width: 100%;
        box-sizing: border-box;
    }
`;

export default Input;
