"use client";

import GuestMoeRow from "./GuestMoeRow";

import {
  Table,
  Menus,
  Empty,
  Spinner,
  SpinnerMini,
  SortBy,
} from "@/components/ui";
import { Pagination } from "@/components/utils";

import { useGuests } from "@/hooks/guests";
// import Pagination from "../../ui/Pagination";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { HiArrowDown, HiArrowUp } from "react-icons/hi2";
import { useSearchParams } from "next/navigation";
import styled from "styled-components";
import { TableContainer , Th , TableBox } from "@/components/ui";
function GuestsTable() {
  const Language = useSettingsStore(state => state.Language);

  const { guests, isLoading } = useGuests();

  return (
    <Menus>
      <TableContainer>
        <TableBox language={Language}>
          <thead>
            <tr>
              {[
                { label: "", sql: "" },
                // { label: "img", sql: "img" },
                { label: "name", sql: "name" },
                { label: "nationality", sql: "nationality" },
                { label: "national id", sql: "national_id" },
                { label: "phone", sql: "phone_number" },
                { label: "Date", sql: "date" },
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
            {isLoading && <tr><td colSpan={20}><Spinner /></td></tr>}
            {guests?.data?.guests?.map((guest: any) => (
              <GuestMoeRow
                GuestItem={guest}
                isLoading={isLoading}
                key={guest.id}
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
                  count={guests?.data?.count}
                  oldcount={guests?.data?.oldcount}
                  pageid={guests?.data?.reports?.at(-1)?.id}
                />
              </td>
            </tr>
          </tfoot>
        </TableBox>
      </TableContainer>
    </Menus>
  );
}

export default GuestsTable;
