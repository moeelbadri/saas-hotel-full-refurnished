"use client";
import styled from "styled-components";

const TableOperations = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  justify-content: flex-start; /* or whatever your default is */

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: stretch;    /* so each child fills the width if you like */
    gap: 1.5rem;             /* maybe a bit smaller on mobile */
  }

  @media (max-width: 768px) {
    gap: 1.2rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    margin: 0 -0.5rem;
    
    /* Make buttons and inputs full width on very small screens */
    & > * {
      width: 100%;
      box-sizing: border-box;
    }
  }
`;

export default TableOperations;
