import styled from 'styled-components';
import React from 'react';
import { SortBy } from '../ui';


const TableContainer = styled.div`
    border: 1px solid var(--color-grey-200);
    background-color: var(--color-grey-0);
    border-radius: 8px;
    overflow: auto;
    color: "var(--color-grey-1000)",
    overflow: "hidden",
    overflowX: "auto",
    minWidth: "70vw",
    fontFamily: "sans-serif",
    fontSize: "1.4rem",
    fontWeight: "600"
`;

const TableBox = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const Th = styled.th`
    padding: 1rem;
    background-color: var(--color-grey-100);
    text-align: left;
    font-weight: bold;
    // border-right: 0.01px solid;
    // borderRadius: 4px;
    letter-spacing: 0.4px;
    font-weight: 600;
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
const Td = styled.td<{ Language?: string }>`
  &:has(img) {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    // border: 0.2px solid;
  }
  &:not(:has(img)) {
    // border: 0.2px solid;
  }

  // borderRadius:4px;
  border-bottom: 1px solid var(--color-grey-100);
  padding: 1.4rem 2.4rem;
  max-width: 250px;
  white-space: normal;
  word-wrap: break-word;
  text-align: ${(props) => (props?.Language === "en" ? "center" : "center")};

  &:empty::before {
    content: "-";
  }
  //&:not(:last-child) {
  //     border-bottom: 1px solid var(--color-grey-100);
  //    }
`;

type GenericTableProps = {
    data?: any[];
    columns: { label: string; sql: string  }[];
    children?: any;
};

function GenericTable({ data, columns, children }: GenericTableProps) {
    const count = data?.[0]?.count;
    return (
        <TableContainer>
            <TableBox>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <Th key={col.label}>{col.label}<SortBy sortBy={col.sql}/></Th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                   {data?.map((row: any) => (
                       <tr key={row.id}>
                         {children[0]?.props?.children?.map((col: any) => (
                             <Td key={col.sql}>{col}</Td>
                         ))}
                       </tr>
                   ))}
                </tbody>
                <tfoot>
                    <tr>
                        <Th colSpan={columns.length}>Total: {count}</Th>
                    </tr>
                </tfoot>
            </TableBox>
        </TableContainer>
    );
}

export default GenericTable;



// function Body({ data,isLoading , render }: TableBodyProps) {
//     if(isLoading) return <Spinner/>
//     if (!data?.length && !isLoading) return <Empty>No data to show at the moment</Empty>;

//     return <StyledBody>{data.map(render)}</StyledBody>;
// }