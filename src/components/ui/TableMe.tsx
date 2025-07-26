// "use client";

// import React, { ReactNode, createContext, useContext } from "react";
// import Spinner from "./Spinner";

// import styled from "styled-components";

// const TableContainer = styled.div`
//   width: 100%;
//   overflow-x: auto;
//   margin: 1rem 0;
// `;
// const StyledTable = styled.table<{ language?: string }>`
//   width: 100%;
//   border-collapse: collapse;
//   text-align: ${(props) =>
//     props.language === "en" ? "left" : "right"};
//   color: #fff;
//   font-family: "Sono", sans-serif;
//   font-size: 1.6rem;
//   font-weight: 600;

// `;
// const StyledHeader = styled.th`
//     padding: 1.6rem 2.4rem;
//     background-color: var(--color-grey-100);
//     border-bottom: 1px solid var(--color-grey-100);
//     text-transform: uppercase;
//     letter-spacing: 0.4px;
//     font-weight: 600;
//     color: var(--color-grey-600);
//   > div {
//     padding: 2rem;
//     text-transform: uppercase;
//     letter-spacing: 0.4px;
//   }
// `
// const Th = styled.th`
//   background-color: #1f2937;
//   padding: 2rem;
//   text-transform: uppercase;
//   letter-spacing: 0.4px;
// `;
// const Td = styled.td`
//   padding: 2rem;
//   max-width: 250px;
//   background-color: #18212f;
//   white-space: normal;

//   &:nth-child(even) {
//     background-color: var(--color-grey-50);
//   }
// `;


// const TableFooter = styled.div`
//   display: flex;
//   justify-content: center;
//   background-color: var(--color-grey-50);
//   padding: 1.2rem;
// `;

// type TableCtxProps = {
//     columns: string;
// };

// const TableContext = createContext<TableCtxProps>({ columns: "" });


// interface TableProps {
//     columns: string;
//   children: ReactNode;
// }

// function Table({ columns, children }: TableProps) {
//     return (
//         //TableContainer
//         <TableContext.Provider value={{ columns }}>
//             <StyledTable language="en" role="table">{children}</StyledTable>
//         </TableContext.Provider>
//     );
// }

// //  const Table1: React.FC<TableProps> & {
// //   Header: typeof Header;
// //   Footer: typeof Footer;
// //   Body: typeof Body;
// // } = ({ children }) => {
// //   return (
// //     <TableContainer>
// //       <StyledTable language="en">{children}</StyledTable>
// //     </TableContainer>
// //   );
// // };

// const Header: React.FC<{ children: ReactNode }> = ({ children }) => {
//     const { columns } = useContext(TableContext);

//     return (
//         <StyledHeader role="row" columns={columns} as="header">
//         {children}
//     </StyledHeader>
//       );
// }

// const Footer: React.FC<{ children: ReactNode }> = ({ children }) => (
//   <TableFooter>{children}</TableFooter>
// );

// const Body: React.FC<{
//   data: any[];
//   isLoading?: boolean;
//   render: (item: any) => ReactNode;
// }> = ({ data, isLoading, render }) => {
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }
//   if (!data.length) {
//     return <div>No data available</div>;
//   }

//   return (
//     <tbody>
//       {data.map(render)}
//     </tbody>
//   );
// };

// Table.Header = Header;
// Table.Footer = Footer;
// Table.Body = Body;

// export default Table;