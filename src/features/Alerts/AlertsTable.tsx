"use client";
import {
  ConfirmDelete,
  Menus,
  Modal,
  SortBy,
  Spinner,
  Tag,
} from "@/components/ui";
import { Alert } from "@/utils/types";
import { AlertsRow, CreateAlertForm } from ".";
import { useGetAlerts } from "@/hooks/settings";

import { Table } from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import styled from "styled-components";
import { formateDate } from "@/utils/helpers";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { Pagination } from "@/components/utils";
import { Td,LoadingRow,TableContainer,TableBox,Th,Tr } from "@/components/ui/MoeTable";
export default function AlertsTable() {
  const { GetAlerts, isgettingAlerts } = useGetAlerts(true);
    // if (isgettingAlerts) return <Spinner />;

  const Language = useSettingsStore(state => state.Language);
  
  if (isgettingAlerts) return <Spinner />;
  return (
    <Menus>
      <TableContainer>
        <TableBox language={Language} >
          <thead>
            <tr>
              {[
                { label: "id", sql: "id" },
                { label: "Type", sql: "priority_level" },
                { label: "Created At", sql: "created_at" },
                { label: "Ends At", sql: "end_date" },
                { label: "Description", sql: "message" },
                { label: "Resolved At", sql: "time_resolved" },
                { label: "Resolved By", sql: "user_id_resolved" },
                { label: "Explain", sql: "explain" },
              ].map((col) => (
                <Th key={col.label}>
                  {Language === "en" ? col.label : col.label}
                  {col.sql &&<SortBy sortBy={col.sql} />}
                </Th>
              ))}
              <Th></Th>
            </tr>
          </thead>
          {isgettingAlerts ? (
            <LoadingRow />
          ) : (
            <tbody>
              {GetAlerts?.data.alerts?.map((Alert: Alert) => (
                <AlertsRow key={Alert.id} Alert={Alert} />
              ))}
            </tbody>
          )}
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
              pageid={GetAlerts?.data.alerts?.[0]?.id} 
              count={GetAlerts?.data.alerts?.[0]?.count} 
              oldcount={GetAlerts?.data.alerts?.[0]?.oldcount}
            />
            </td>
          </tr>
         </TableBox>
        </TableContainer>
    </Menus>
  );
}
