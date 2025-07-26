"use client";
import styled, { css } from "styled-components";

const Form = styled.form<{ type?: string; iswide?: boolean; iswidestring?: string }>`
    ${(props) =>
        props.type === "regular" &&
        css`
            width: ${props.iswidestring === "true" ? "90rem": "30rem"};
            padding: 2.4rem 4rem;

            /* Box */
            background-color: var(--color-grey-0);
            border: 1px solid var(--color-grey-100);
            border-radius: var(--border-radius-md);

            @media (max-width: 1200px) {
                padding: 2rem 3rem;
            }

            @media (max-width: 768px) {
                padding: 1.5rem 2rem;
                border-radius: var(--border-radius-sm);
            }

            @media (max-width: 480px) {
                padding: 1.2rem 1.5rem;
                margin: 0 -0.5rem;
                border-left: none;
                border-right: none;
                border-radius: 0;
            }
        `}

    ${(props) =>
        props.type === "modal" &&
        css`
            width: ${props.iswidestring === "true" ? "90rem": "30rem"};

            @media (max-width: 1200px) {
                min-width: 50rem;
                width: 100%;
                max-width: none;
            }

            @media (max-width: 768px) {
                min-width: 40rem;
                width: 100%;
                max-width: none;
            }

            @media (max-width: 480px) {
                width: 100%;
                max-width: none;
                padding: 0 1.2rem;
                margin: 0 auto;
                justify-content: center;
                text-align: center;
                item-align: center;
            }
        `}
    
    overflow: hidden;
    font-size: 1.4rem;

    @media (max-width: 768px) {
        font-size: 1.3rem;
    }

    @media (max-width: 480px) {
        font-size: 1.2rem;
    }
`;

Form.defaultProps = {
    type: "regular",
    iswide: false,
    iswidestring: "false",
};

export default Form;
