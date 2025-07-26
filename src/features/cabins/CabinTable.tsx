"use client";
import { useCabins } from "@/hooks/cabins";
import { Menus, SortBy, Spinner, TableBox, TableContainer, Th } from "@/components/ui";
import { Cabin } from "@/utils/types";
import { CabinMoeRow } from ".";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/utils";
import { useSettingsStore } from "@/components/WizardForm/useStore";
function CabinTable() {
    const Language = useSettingsStore(state => state.Language);
    const { cabins, isLoading } = useCabins();
    if (isLoading) return <Spinner />;

    const groupedObject = cabins?.data.cabins.reduce((acc: any, item: Cabin) => {
        if (!acc[item.type]) {
          acc[item.type] = [];
        }
        acc[item.type].push(item.name,item.id);
        return acc;
      }, {});

    return (
   <Menus>
      <TableContainer>
        <TableBox language={Language}>
          <thead>
            <tr>
              {[
                { label: "id", sql: "id" },
                { label: "img", sql: "image" },
                { label: "room number", sql: "name" },
                { label: "Room Type", sql: "type" },
                { label: "Price", sql: "regular_price" },
                { label: "Discount", sql: "" },
                // { label: "Hotel", sql: "Hotel" },
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
            {cabins?.data.cabins?.map((cabin: any) => (
              <CabinMoeRow
                cabin={cabin}
                groupedObject={groupedObject[cabin.type]}
                // isLoading={isLoading}
                key={cabin.id}
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
                count={cabins?.data?.count}
                oldcount={cabins?.data?.oldcount}
                pageid={cabins?.data?.cabins?.at(-1)?.id}
            />
              </td>
            </tr>
          </tfoot>
        </TableBox>
      </TableContainer>
    </Menus>
    );
}

export default CabinTable;
