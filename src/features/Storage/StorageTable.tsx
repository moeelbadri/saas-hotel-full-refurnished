"use client";

import {
  useGetStorageActivities,
  useGetStorageItemsCategories,
} from "@/hooks/storage";
import {
  ConfirmConsumption,
  ConfirmDelete,
  ConfirmReplinch,
  Menus,
  Modal,
  SortBy,
  Spinner,
  TableBox,
  TableContainer,
  Tag,
  Th,
} from "@/components/ui";
import StorageRow from "./StorageRow";
import { useSearchParams } from "next/navigation";
import { Table } from "@/components/ui";
import { MoeTable, Pagination } from "@/components/utils";
import { useEffect, useRef, useState } from "react";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import styled from "styled-components";
import router from "next/router";
import { HiEye, HiPencil, HiPlus, HiMinus, HiTrash } from "react-icons/hi2";
import CreateStorageItemForm from "./CreateStorageItemForm";
import { formatCurrency , formateDate} from "@/utils/helpers";
import { CreateAlertForm } from "../Alerts";
import { useTranslation } from "react-i18next";
import StorageMoeRow from "./StorageMoeRow";

function StorageTable() {
  const Language = useSettingsStore(state => state.Language);
  // const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { isLoading, error, StorageItems } = useGetStorageActivities();
  // if (isLoading) return <Spinner />;
  return (
    <Menus>
      <TableContainer>
        <TableBox language={Language}>
          <thead>
            <tr>
              {[
                { label: "id", sql: "id" },
                { label: "Img", sql: "" },
                { label: "Item Name", sql: "name" },
                { label: "quantity", sql: "quantity" },
                { label: "price", sql: "cost" },
                { label: "category", sql: "category" },
                { label: "location", sql: "location" },
              ].map((col) => (
                <Th key={col.label} language={Language}>
                  {Language === "en" ? col.label : col.label}
                  {col.sql && <SortBy sortBy={col.sql} />}
                </Th>
              ))}
              <Th></Th>
            </tr>
          </thead>
          <tbody>
              {StorageItems?.data.storage.map((item: any) => (
                <StorageMoeRow
                  key={item.id}
                  StorageItems={item}
                />
              ))}
            </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={20}
                    style={{
                      backgroundColor: "var(--color-grey-50)",
                      textAlign: "center",
                      padding: "1.2rem",
                    }}
                  >
                    <Pagination 
                    count={StorageItems?.data.storage?.[0]?.count} 
                    oldcount={StorageItems?.data.storage?.[0]?.oldcount}
                    pageid={StorageItems?.data.storage.at(-1)?.id} 
                    />
                  </td>
                </tr>
              </tfoot>
        </TableBox>
      </TableContainer>
    </Menus>
  );
}

export default StorageTable;

{
  /* <Table columns="0.85fr 1.9fr 2.0fr 1.1fr 1.1fr 1.1fr 1fr 0.3fr">
          
<Table.Header>
<div>{Language==="en"?"id":"رقم المنتج "}</div>
    <div>{Language==="en"?"img":"صورة المنتج"}</div>
    <div>{Language==="en"?"name":"اسم المنتج"}</div>
    <div>{Language==="en"?"qty":"الكمية"}</div>
    <div>{Language==="en"?"price":"السعر"}</div>
    <div>{Language==="en"?"category":"النوع"}</div>
    <div>{Language==="en"?"location":"الموقع"}</div>
    {/* <div>Hotel</div> */
}
//     <div></div>
// </Table.Header>

// <Table.Body
//      isLoading={isLoading}
//     data={StorageItems?.data.storage}
//     render={(item:any) => {
//         return (
//             <StorageRow
//                 Storage={{ ...item }}
//                 key={item.id}
//             />
//         );
//     }}
// />
//     <Table.Footer>
//     <Pagination count={StorageItems?.data.storage?.[0]?.count} />
// </Table.Footer>
// </Table> */}
