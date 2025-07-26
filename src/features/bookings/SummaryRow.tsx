"use client";
import styled from "styled-components";



import { Table} from "@/components/ui";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
// Item Price Day Total
const Item = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;
const Price = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;
const Day = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Total_Price = styled.div`
    font-family: "Sono";
    font-weight: 500;
`;
type RowPropType = {
    Row: {
        days: number;
        item: string;
        price:number
    };
};
export default function SummaryRow({
    Row: {
        days,
        item,
        price,
    },
}: RowPropType) {

return (
    <Table.Row>
        <Item>{item}</Item>
        <Day>{days}</Day>
        <Price>{formatCurrency(price)}</Price>
        <Total_Price>{formatCurrency(price * days)}</Total_Price>
    </Table.Row>
)    

}