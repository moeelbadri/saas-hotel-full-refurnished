"use client";
import styled, { css } from "styled-components";

type ButtonProps = {
    size?: "small" | "medium" | "large";
    variant?: "primary" | "secondary" | "danger";
};

const sizes = {
    small: css`
        font-size: 1.2rem;
        padding: 0.4rem 0.8rem;
        text-transform: uppercase;
        font-weight: 600;
        text-align: center;

        @media (max-width: 1200px) {
            font-size: 1.1rem;
            padding: 0.6rem 1rem;
        }

        @media (max-width: 768px) {
            font-size: 1rem;
            padding: 0.8rem 1.2rem;
            min-height: 4rem; /* Better touch target */
        }
    `,
    medium: css`
        font-size: 1.4rem;
        padding: 1.2rem 1.6rem;
        font-weight: 500;

        @media (max-width: 1200px) {
            font-size: 1.3rem;
            padding: 1.4rem 1.8rem;
        }

        @media (max-width: 768px) {
            font-size: 1.2rem;
            padding: 1.6rem 2rem;
            min-height: 4.4rem; /* Better touch target */
        }
    `,
    large: css`
        font-size: 1.6rem;
        padding: 1.2rem 2.4rem;
        font-weight: 500;

        @media (max-width: 1200px) {
            font-size: 1.5rem;
            padding: 1.4rem 2.6rem;
        }

        @media (max-width: 768px) {
            font-size: 1.4rem;
            padding: 1.8rem 3rem;
            min-height: 4.8rem; /* Better touch target */
        }
    `,
};

const variants = {
    primary: css`
        color: var(--color-brand-50);
        background-color: var(--color-brand-600);

        &:hover {
            background-color: var(--color-brand-700);
        }
    `,
    secondary: css`
        color: var(--color-grey-600);
        background: var(--color-grey-0);
        border: 1px solid var(--color-grey-200);

        &:hover {
            background-color: var(--color-grey-50);
        }
    `,
    danger: css`
        color: var(--color-red-100);
        background-color: var(--color-red-700);

        &:hover {
            background-color: var(--color-red-800);
        }
    `,
};

const Button = styled.button<ButtonProps>`
    border-radius: var(--border-radius-sm);
    border: none;
    box-shadow: var(--shadow-sm);
    
    &:hover {
        cursor: pointer;
    }

    ${({ size = "medium", variant = "primary" }) => css`
        ${sizes[size]}
        ${variants[variant]}
    `}
`;

export default Button;
