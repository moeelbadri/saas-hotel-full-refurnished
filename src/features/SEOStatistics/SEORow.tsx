"use client";
import styled from "styled-components";
import { formatCurrency } from "@/utils/helpers";

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 2.4rem;
    align-items: center;
    padding: 1.4rem 2.4rem;

    &:not(:last-child) {
        border-bottom: 1px solid var(--color-grey-100);
    }
`;

const Img = styled.img`
    display: block;
    width: 6.4rem;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
`;

const Column = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Price = styled.div`
    font-family: "Sono";
    font-weight: 600;
`;
// const Hotel = styled.div`
//     font-family: "Sono";
//     font-weight: 500;
//     color: var(--color-green-700);
// `;
//cabins.roomsCategories.typename
function SEORow({ data }: { data: any}) {
    const values = data ? Object.values(data) : [];
    // console.log(data)
    return (
        <>
            <TableRow>
             {values.map((value: any, index) => (
                 <Column key={`${index} - ${value}`}>{value}</Column>
             ))}
            {/* <Column>{data?.cabins?.name}</Column> */}
            {/* <Column>{data?.name}</Column> */}
            {/* <Column>{formatCurrency(data?.sum)}</Column> */}
            {/* <Column>{data?.rate}</Column> */}
                {/* <Column>{data?.cabins?.roomsCategories?.typename}</Column> */}
            {/* <Column>{data?.created_at}</Column> */}
                {/* <div>{total_bookings}</div> */}
                {/* <Price> */}
                    {/* {total_revenue>=100?formatCurrency(total_revenue):total_revenue} */}
                {/* </Price> */}
            </TableRow>
        </>
    );
}

export default SEORow;
