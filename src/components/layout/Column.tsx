"use client";
import styled from "styled-components";

/**
 * Align Items in flexbox
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
 *
 * */

const ALIGNMENTS = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
  baseline: "baseline",
} as const;



/**
 * Column component
 *
 * @description Places items in a column
 * @param {string} align - align-items property for flexbox
 * @returns {React.JSX.Element}
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
 *
 * */
type AlignOptions = keyof typeof ALIGNMENTS;

interface ColumnProps {
  align?: AlignOptions;
}
const Column = styled.div<ColumnProps>`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: ${({ align = "stretch" }) => ALIGNMENTS[align]};
`;

Column.defaultProps = {
    align: "stretch",
};

export default Column;
