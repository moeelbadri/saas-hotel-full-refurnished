"use client";
import { useGetAllDiscounts } from "@/hooks/discounts";
import { ConfirmDelete, Menus, Modal, SortBy, Spinner, Tag } from "@/components/ui";
import { discounts } from "@/utils/types";
import { DiscountMoeRow } from ".";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { Pagination } from "@/components/utils";
import styled from "styled-components";
import { LoadingRow, TableBox, TableContainer, Th } from "@/components/ui/MoeTable";

function CabinTable() {
    const Language = useSettingsStore(state => state.Language);
    const { discounts,error, isLoading } = useGetAllDiscounts();
    // if (isLoading) return <Spinner />;

    return (
        <Menus >
            <TableContainer>
               <TableBox language={Language}>
                   <thead>
                       <tr>
                        {[
                            { label: "id", sql: "id" },
                            { label: "created at", sql: "created_at" },
                            { label: "Discount%", sql: "discount" },
                            { label: "Start Date", sql: "start_date" },
                            { label: "End Date", sql: "end_date" },
                            { label: "Status", sql: "" },
                            { label: "Description", sql: "description" },
                        ].map((col) => (
                            <Th key={col.label}>
                                {Language === "en" ? col.label : col.label}
                                {col.sql &&<SortBy sortBy={col.sql} />}
                            </Th>
                            ))}
                            <Th></Th>
                       </tr>
                   </thead>
                 <tbody>
                   {isLoading ? LoadingRow() : discounts?.data?.discounts?.map((discount: discounts) => (
                       <DiscountMoeRow key={discount.id} discount={discount} />
                   ))}
                 </tbody>
               </TableBox>
            </TableContainer>
        </Menus>
    );
}

export default CabinTable;
