"use client";
import styled from "styled-components";

const Textarea = styled.textarea`
    padding: 0.8rem 1.2rem;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--border-radius-sm);
    background-color: var(--color-grey-0);
    box-shadow: var(--shadow-sm);
    width: 100%;
    height: 8rem;

    @media (max-width: 1200px) {
        padding: 1rem 1.4rem;
        height: 9rem;
        font-size: 1.4rem;
    }

    @media (max-width: 768px) {
        padding: 1.2rem 1.6rem;
        height: 10rem;
        font-size: 1.6rem;
        border-radius: var(--border-radius-md);
    }

    @media (max-width: 480px) {
        padding: 1.4rem 1.8rem;
        height: 12rem;
        font-size: 1.6rem;
        box-sizing: border-box;
    }
`;

export default Textarea;
