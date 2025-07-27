"use client";

import { useGetUsers } from "@/hooks/authentication";
import { Menus, SortBy, Spinner, TableBox, TableContainer, Th } from "@/components/ui";
import { AddUser, UserRow } from ".";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/utils";
import { Table } from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { Column } from "@/components/layout";
import {useSettings} from '@/hooks/settings'
import UserMoeRow from "./UserMoeRow";
import StorageMoeRow from "../Storage/StorageMoeRow";
export default function UsersTable() {
    const Language = useSettingsStore(state => state.Language);
    const { Users,error, isLoading } = useGetUsers();
    const {settings,isLoading:isLoadingSettings}=useSettings();
    // const searchParams = useSearchParams();
    if (isLoading||isLoadingSettings) return <Spinner />;
    return (
        <Menus>
            <Column align="start">
            <AddUser disabled={((Users?.data?.users?.length||0)>settings?.data?.settings?.max_number_users!)}/>
            </Column> 
                  <TableContainer>
                    <TableBox language={Language}>
                      <thead>
                        <tr>
                          {[
                            { label: "", sql: "" },
                            { label: "User Info", sql: "" },
                            { label: "Last Action At", sql: "" },
                            { label: "Status", sql: "" },
                            { label: "Permissions", sql: "" },
                            { label: "Phone", sql: "" },
                            { label: "Created", sql: "" },
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
                          {Users?.data?.users.map((user: any) => (
                           <UserMoeRow
                                User={{ ...user }}
                                key={user.id}
                            />
                          ))}
                        </tbody>
                          {/* <tfoot>
                            <tr>
                              <td
                                colSpan={20}
                                style={{
                                  backgroundColor: "var(--color-grey-50)",
                                  textAlign: "center",
                                  padding: "1.2rem",
                                }}
                              > */}
                                {/* <Pagination 
                                count={StorageItems?.data.storage?.[0]?.count} 
                                oldcount={StorageItems?.data.storage?.[0]?.oldcount}
                                pageid={StorageItems?.data.storage.at(-1)?.id} 
                                /> */}
                              {/* </td> */}
                            {/* </tr> */}
                          {/* </tfoot> */}
                    </TableBox>
                  </TableContainer>
             {/* <Table columns="0.5fr 3fr 2.5fr 2fr 2fr 2fr 1fr 0.3fr">
                <Table.Header> */}
                    {/* <div>{Language==="en"?"photo":"صورة"}</div> */}
                    {/* <div></div> Empty for avatar column */}
                    {/* <div>{Language === "en" ? "User Info" : "معلومات المستخدم"}</div> */}
                    {/* <div>{Language === "en" ? "Last Action At" : "اخر نشاط في"}</div>
                    <div>{Language === "en" ? "Status" : "الحالة"}</div>
                    <div>{Language === "en" ? "Permissions" : "الصلاحيات"}</div>
                    <div>{Language === "en" ? "Phone" : "الهاتف"}</div>
                    <div>{Language === "en" ? "Created" : "تاريخ الإنشاء"}</div> */}
                    {/* <div></div> Empty for actions column */}
                    {/* <div>Hotel</div> */}
                    {/* <div></div> */}
                {/* </Table.Header> */}

                {/* <Table.Body
                    data={Users?.data?.users}
                    isLoading={isLoading}
                    render={(user: any) => {
                        return (
                            <UserMoeRow
                                User={{ ...user }}
                                key={user.id}
                            />
                        );
                    }}
                /> */}
                  {/* <Table.Footer> */}
                    {/* <Pagination count={Users?.length??0} /> */}
                {/* </Table.Footer> */}
            {/* </Table> */}
        </Menus>
    );
}
