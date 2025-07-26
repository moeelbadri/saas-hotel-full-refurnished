"use client";

import React, { ReactNode, createContext, useContext } from "react";
import styled from "styled-components";
import Spinner from "./Spinner";

const StyledTable = styled.div`
    border: 1px solid var(--color-grey-200);

    font-size: 1.4rem;
    background-color: var(--color-grey-0);
    border-radius: 7px;
    overflow: hidden;

    @media (max-width: 1200px) {
        font-size: 1.3rem;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    @media (max-width: 768px) {
        font-size: 1.2rem;
        border-radius: 5px;
    }

    @media (max-width: 480px) {
        font-size: 1.1rem;
        margin: 0 -0.5rem;
        border-radius: 0;
        border-left: none;
        border-right: none;
    }
`;

const CommonRow = styled.div<{ role?: any; columns?: any; minwidth?: string }>`
    display: grid;
    grid-template-columns: ${(props) => props.columns};
    column-gap: 2.4rem;
    align-items: center;
    transition: none;
    min-width: ${(props) => props.minwidth || "700px"};

    @media (max-width: 1200px) {
        column-gap: 1.6rem;
        min-width: 700px; /* Ensure horizontal scroll for tables */
    }

    @media (max-width: 768px) {
        column-gap: 1.2rem;
        min-width: 600px;
    }

    @media (max-width: 480px) {
        column-gap: 0.8rem;
        min-width: 500px;
        padding: 0 0.5rem;
    }
`;

const StyledHeader = styled(CommonRow)`
    padding: 1.6rem 2.4rem;

    background-color: var(--color-grey-50);
    border-bottom: 1px solid var(--color-grey-100);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-weight: 600;
    color: var(--color-grey-600);

    @media (max-width: 1200px) {
        padding: 1.4rem 2rem;
        font-size: 1.2rem;
    }

    @media (max-width: 768px) {
        padding: 1.2rem 1.5rem;
        font-size: 1.1rem;
    }

    @media (max-width: 480px) {
        padding: 1rem 1rem;
        font-size: 1rem;
    }
`;

const StyledRow = styled(CommonRow)`
    padding: 1.2rem 2.4rem;

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }

    @media (max-width: 1200px) {
        padding: 1rem 2rem;
    }

    @media (max-width: 768px) {
        padding: 0.8rem 1.5rem;
    }

    @media (max-width: 480px) {
        padding: 0.8rem 1rem;
    }
`;

const StyledBody = styled.section`
    margin: 0.4rem 0;

    @media (max-width: 768px) {
        margin: 0.2rem 0;
    }
`;

const Footer = styled.footer`
    background-color: var(--color-grey-50);
    display: flex;
    justify-content: center;
    padding: 1.2rem;

    /* This will hide the footer when it contains no children */
    &:not(:has(*)) {
        display: none;
    }

    @media (max-width: 768px) {
        padding: 1rem;
    }

    @media (max-width: 480px) {
        padding: 0.8rem;
    }
`;

const Empty = styled.p`
    font-size: 1.6rem;
    font-weight: 500;
    text-align: center;
    margin: 2.4rem;

    @media (max-width: 1200px) {
        font-size: 1.4rem;
        margin: 2rem;
    }

    @media (max-width: 768px) {
        font-size: 1.3rem;
        margin: 1.5rem;
    }

    @media (max-width: 480px) {
        font-size: 1.2rem;
        margin: 1rem;
    }
`;

type TableCtxProps = {
    columns: string;
    minwidth?:string
};

const TableContext = createContext<TableCtxProps>({ columns: "" , minwidth: "1000px" });

type TableProps = {
    columns: string;
    minwidth?:string
    children?: ReactNode;
};

function Table({ columns,minwidth, children }: TableProps) {
    return (
        <TableContext.Provider value={{ columns , minwidth:minwidth}}>
            <StyledTable role="table">{children}</StyledTable>
        </TableContext.Provider>
    );
}

type TableHeaderProps = {
    children: ReactNode;
};
function Header({ children }: TableHeaderProps) {
    const { columns , minwidth } = useContext(TableContext);
    return (
        <StyledHeader role="row" columns={columns} minwidth={minwidth} as="header">
            {children}
        </StyledHeader>
    );
}

type TableRowProps = {
    children: ReactNode;
    style?: React.CSSProperties;
};
function Row({ children, style }: TableRowProps) {
    const { columns , minwidth } = useContext(TableContext);
    return (
        <StyledRow style={style} role="row" columns={columns} minwidth={minwidth} >
            {children}
        </StyledRow>
    );
}

type TableBodyProps = {
    data: any;
    isLoading:any;
    render: (tableData: any) => any;
};

function Body({ data,isLoading , render }: TableBodyProps) {
    if(isLoading) return <Spinner/>
    if (!data?.length && !isLoading) return <Empty>No data to show at the moment</Empty>;

    return <StyledBody>{data.map(render)}</StyledBody>;
}


Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.Footer = Footer;

export default Table;
