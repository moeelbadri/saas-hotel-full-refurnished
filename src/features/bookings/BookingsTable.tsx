import BookingRowMoe from "./BookingRowMoe";

import { Table, Menus, Empty, Spinner, SortBy } from "@/components/ui";
import { Pagination } from "@/components/utils";

import { useBookings } from "@/hooks/bookings";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { TableContainer, Th, TableBox } from "@/components/ui";
import { LoadingRow } from "@/components/ui/MoeTable";

function BookingTable() {
  const Language = useSettingsStore(state => state.Language);
  const { bookings, isLoading } = useBookings();
  return (
    <Menus>
      <TableContainer>
        <TableBox language={Language}>
          <thead>
            <tr>
              {[
                { label: "", sql: "" },
                { label: "id", sql: "id" },
                { label: "Guest", sql: "guest_p" },
                { label: "Dates", sql: "" },
                { label: "status", sql: "" },
                { label: "paid/amount", sql: "date" },
                { label: "created at", sql: "created at" },
                { label: "created by", sql: "created by" },
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
          {isLoading ? LoadingRow() : (bookings?.data.bookings?.map((booking: any) => (
              <BookingRowMoe
                BookingItem={booking}
                isLoading={isLoading}
                key={booking.id}
              />
            )))
          }
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
                  count={bookings?.data?.count}
                  oldcount={bookings?.data?.oldcount}
                  pageid={bookings?.data?.bookings?.at(-1)?.id}
                />
              </td>
            </tr>
          </tfoot>
        </TableBox>
      </TableContainer>
    </Menus>
  );
}

export default BookingTable;
