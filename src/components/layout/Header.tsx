"use client";
import styled from "styled-components";
import HeaderMenu from "./HeaderMenu";

const StyledHeader = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-grey-0);
    // padding: 0.0rem 0.1rem;
    border-bottom: 1px solid var(--color-grey-100);
    width: 100%;
    box-sizing: border-box;
    z-index: 1001;
    @media (max-width: 1200px) {
        // padding: 0rem 1.5rem;
          height: 5rem;
        width: 100%;
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        box-shadow: var(--shadow-sm);
    }

    @media (max-width: 768px) {
        // padding: 1rem 1rem;
        height: 5rem;
        width: 100%;
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        box-shadow: var(--shadow-sm);
    }

    @media (max-width: 480px) {
        // padding: 0.8rem;
        height: 5.5rem;
       width: 100%;
    }
`;

function Header() {
    return (
        <StyledHeader>
            <HeaderMenu />
        </StyledHeader>
    );
}

export default Header;
