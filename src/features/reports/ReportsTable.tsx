"use client";

import { Menus, SortBy, Spinner } from "@/components/ui";
import ReportsRow from "./ReportsRow";
import { useSearchParams } from "next/navigation";
import { Table } from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useGetStorageReportsWithUsers } from "@/hooks/reports";
import { Pagination } from "@/components/utils";
import styled from "styled-components";
import { useEffect, useState } from "react";
import ReportsMoeRow from "./ReportsMoeRow";
import { LoadingRow } from "@/components/ui/MoeTable";
const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & span:first-child {
    font-weight: 600;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.5rem;
  }
`;
const Empty = styled.p`
  font-size: 1.6rem;
  font-weight: 500;
  text-align: center;
  margin: 2.4rem;
  color: white;
`;
const TableContainer = styled.div`
  border: 1px solid var(--color-grey-200);
  background-color: var(--color-grey-0);
  border-radius: 8px;
  overflow: auto; // Enables scrolling
`;
const TableBox = styled.table<{ language?: string }>`
  min-width: max-content; /* Set a fixed minimum width */
  width: 100%;
  border: 1px solid var(--color-grey-200);
  border-radius: 7px;
  background-color: var(--color-grey-0);
  bordercollapse: "collapse";
  textalign: ${(props) => (props?.language === "en" ? "left" : "right")};
  color: "var(--color-grey-1000)";
  overflow: "hidden";
  overflowx: "auto";
  fontfamily: "sans-serif";
  fontsize: "1.6rem";
  fontweight: "600";
`;
const Th = styled.th<{ language?: string }>`
  border-right: 0.01px solid;
  // borderRadius: 4px;
  background-color: var(--color-grey-100);
  padding: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  text-align: ${(props) => (props?.language === "en" ? "center" : "center")};
`;

function ReportsTable() {
  const Language = useSettingsStore(state => state.Language);
  const { StorageReportsUsers, error, isLoading } = useGetStorageReportsWithUsers();
  return (
    <Menus>
      <TableContainer>
        <TableBox language={Language}>
          <thead>
            <tr>
              {[
                { label: "id", sql: "id" },
                { label: "img", sql: "img" },
                { label: "name", sql: "name" },
                { label: "qty", sql: "qty" },
                { label: "cost", sql: "cost" },
                { label: "type", sql: "type" },
                { label: "Date", sql: "date" },
                { label: "user", sql: "user" },
                { label: "note", sql: "note" },
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
            {isLoading ? LoadingRow() : (StorageReportsUsers?.data?.reports?.map((report: any) => (
              <ReportsMoeRow
                ReportItem={report}
                // isLoading={isLoading}
                key={report.id}
              />
            )))}
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
                  count={StorageReportsUsers?.data?.count}
                  oldcount={StorageReportsUsers?.data?.oldcount}
                  pageid={StorageReportsUsers?.data?.reports?.at(-1)?.id}
                />
              </td>
            </tr>
          </tfoot>
        </TableBox>
      </TableContainer>
    </Menus>
  );
}

export default ReportsTable;
