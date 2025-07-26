import styled from "styled-components";
import { SpinnerMini } from ".";
import { useState } from "react";

const TableContainer = styled.div`
  border: 1px solid var(--color-grey-400);
  background-color: var(--color-grey-0);
  border-radius: 10px;
  overflow-y: auto; // Enables scrolling
  overflow-x: autp; // Enables horizontal scrolling
  width: auto;
`;
const TableBox = styled.table<{ language?: string }>`
  min-width: max-content; /* Set a fixed minimum width */
  width: 100%;
  // border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-0);
  // bordercollapse: "collapse";
  border-spacing: 0;
  textalign: ${(props) => (props?.language === "en" ? "left" : "right")};
  fontfamily: "sans-serif";
  fontsize: "1.2rem";
  fontweight: "600";
`;
const Th = styled.th<{ language?: string }>`
  // border-right: 0.01px solid;
  background-color: var(--color-grey-table);
  padding: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  text-align: ${(props) => (props?.language === "en" ? "center" : "center")};
  `;
const Td = styled.td<{ bg?: string , compact?: string}>`
    // border: 0.2px solid;
    border-bottom: 1px solid var(--color-grey-400);
    ${props => props?.compact ? "" : " padding: 1.4rem 3.4rem;"}
    background-color: ${props => `var(--color-${props.bg}-100)` || `var(--color-grey-500)`};
    white-space: normal;
    word-wrap: break-word;
    text-align: center;
     transition: color 0.6s ease-out;
    &:empty::before { content: "—"; }
    //  &:not(:last-child) {
    //     border-bottom: 1px solid var(--color-grey-100);
    //     }
`;
const Tr = styled.tr`
   position: relative;
     /* odd cells: white */
  &:nth-child(odd) {
    background-color: var(--color-grey-000);
  }

  /* even cells: light grey */
  &:nth-child(even) {
    background-color: var(--color-grey-100);
  }
    `;

  const Img = styled.img<{ isenlarged: string }>`
      display: block;
      width: 7rem;
      aspect-ratio: 3 / 2;
      // object-fit: cover;
      object-position: center;
      transform: scale(1.4);
      ${({ isenlarged }: { isenlarged: string }) => isenlarged === "false" && " transition: transform 0.3s ease-in-out;"}
      &:hover {
         cursor: pointer;
         ${({ isenlarged }: { isenlarged: string }) => isenlarged === "false" && "transform: scale(1.7);"}
      }
    ${({ isenlarged }: { isenlarged: string }) => isenlarged === "true" &&
    `
      position: fixed;
      top: 50%;
      left: 50%;
      width: auto;
      height: auto;
      max-width: 90%;
      max-height: 90%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      border: 20px solid #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    `}
  `;
   const Empty = styled.p`
      font-size: 1.6rem;
      font-weight: 500;
      text-align: center;
      margin: 2.4rem;
    `;
    const Stacked = styled.div`
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
  
      & span:first-child {
        font-weight: 600;
      }
  
      & span:last-child {
        color: var(--color-grey-500);
        font-size: 1.5rem;
      }
    `;
  const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  `;
    const TdImage = styled.td<{ Language?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;

  // border: 0.2px solid;
  border-bottom: 1px solid var(--color-grey-400);
  padding: 1.4rem 2.4rem;
  max-width: 250px;
  background-color: var(--color-grey-000);
  white-space: normal;
  word-wrap: break-word;
  text-align: center;

  &:empty::before {
    content: "-";
  }
`;
  const ImageComponent = ({ src, alt }: { src: string; alt: string }) => {
        const [isEnlarged, setIsEnlarged] = useState(false);
      
        const handleClickOutside = () => {
          setIsEnlarged(false);
        };
      
        return (
          <>
            {isEnlarged && <Overlay onClick={handleClickOutside} />}
            <Img
              src={src}
              alt={alt}
              isenlarged={isEnlarged.toString()}
              onClick={() => setIsEnlarged(true)}
            />
          </>
        );
      };
const LoadingRow = () => <tr><Td colSpan={20}><SpinnerMini /></Td></tr>;
export { TableContainer, TableBox, Th , Td, LoadingRow, Tr,ImageComponent,TdImage, Empty,Stacked };