"use client";
import styled, { css } from "styled-components";

const Heading = styled.h1<{ as?: string }>`
    ${(props) =>
        props.as === "h1" &&
        css`
            font-size: 3rem;
            font-weight: 600;

            @media (max-width: 1200px) {
                font-size: 2.8rem;
            }

            @media (max-width: 768px) {
                font-size: 2.5rem;
            }

            @media (max-width: 480px) {
                font-size: 2.2rem;
            }
        `}

    ${(props) =>
        props.as === "h2" &&
        css`
            font-size: 2rem;
            font-weight: 600;

            @media (max-width: 1200px) {
                font-size: 1.9rem;
            }

            @media (max-width: 768px) {
                font-size: 1.8rem;
            }

            @media (max-width: 480px) {
                font-size: 1.6rem;
            }
        `}
        
    ${(props) =>
        props.as === "h3" &&
        css`
            font-size: 2rem;
            font-weight: 500;

            @media (max-width: 1200px) {
                font-size: 1.8rem;
            }

            @media (max-width: 768px) {
                font-size: 1.7rem;
            }

            @media (max-width: 480px) {
                font-size: 1.5rem;
            }
        `}

    ${(props) =>
        props.as === "h4" &&
        css`
            font-size: 3rem;
            font-weight: 600;
            text-align: center;

            @media (max-width: 1200px) {
                font-size: 2.8rem;
            }

            @media (max-width: 768px) {
                font-size: 2.5rem;
            }

            @media (max-width: 480px) {
                font-size: 2.2rem;
            }
        `}
        
    line-height: 1.4;
`;

export default Heading;
