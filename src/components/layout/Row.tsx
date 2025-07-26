"use client";
import styled from "styled-components";

/**
 * Justify Content in flexbox
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
 *
 * */
const ALIGNMENTS = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
  even: "space-evenly",
} as const;

/**
 * Row component
 *
 * @description Places items in a row
 * @param {string} justify - justify-content property for flexbox
 * @returns {React.JSX.Element}
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
 */
type JustifyOptions = keyof typeof ALIGNMENTS;

interface RowProps {
  justify?: JustifyOptions;
  direction?: "row" | "column";
}
const Row = styled.div<RowProps>`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: center;
  justify-content: ${({ justify = "between" }) => ALIGNMENTS[justify]};
  @media (max-width: 800px) { // 768px
    flex-direction: ${({ direction = "column" }) => direction};
  }
`;

export default Row;
