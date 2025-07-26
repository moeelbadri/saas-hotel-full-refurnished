"use client";
import styled from "styled-components";



import { Table} from "@/components/ui";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import { useSettings } from "@/hooks/settings";
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
        day: number;
        totalDays: number;
        name: string;
        item: string;
        cost:number;
        totalPrice: number;
        marginLeft?: number
    };
};
export default function BookingRow({
    Row: {
        day,
        totalDays,
        name,
        item,
        cost,
        totalPrice,
        marginLeft
    },
}: RowPropType) {
    if (!(typeof day === 'undefined' || typeof totalDays === 'undefined')) {
        return null; // or any other fallback UI
    }
      const { settings } = useSettings();
    const vat = (settings?.data?.settings?.vat ?? 0) || 0;
return (
    <Table.Row>
        <Item style={{ marginLeft: marginLeft ?? 0 }}>{name || item}</Item>
        <Price>{formatCurrency(totalPrice ? (totalPrice/totalDays) : cost)}</Price>
        <Day>{totalDays ? totalDays : day}</Day>
        <Total_Price>{formatCurrency(totalPrice ? totalPrice : (cost * day))}</Total_Price>
        <Total_Price>{formatCurrency((totalPrice ? totalPrice : (cost * day)) * (1 + vat / 100))}</Total_Price>
    </Table.Row>
       )
}