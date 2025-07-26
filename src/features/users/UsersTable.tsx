"use client";

import { useGetUsers } from "@/hooks/authentication";
import { Menus, Spinner } from "@/components/ui";
import { AddUser, UserRow } from ".";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/utils";
import { Table } from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { Column } from "@/components/layout";
import {useSettings} from '@/hooks/settings'
export default function UsersTable() {
    const Language = useSettingsStore(state => state.Language);
    const { Users,error, isLoading } = useGetUsers();
    const {settings,isLoading:isLoadingSettings}=useSettings();
    const searchParams = useSearchParams();
    if (isLoading||isLoadingSettings) return <Spinner />;
    return (
        <Menus>
            <Column align="start">
            <AddUser disabled={((Users?.data?.users?.length||0)>settings?.data?.settings?.max_number_users!)}/>
            </Column> 
             <Table columns="0.5fr 3fr 2.5fr 2fr 2fr 2fr 1fr 0.3fr">
                <Table.Header>
                    {/* <div>{Language==="en"?"photo":"صورة"}</div> */}
                    <div></div> {/* Empty for avatar column */}
                    <div>{Language === "en" ? "User Info" : "معلومات المستخدم"}</div>
                    <div>{Language === "en" ? "Last Sign in At" : "اخر تسجيل دخول للحساب"}</div>
                    <div>{Language === "en" ? "Status" : "الحالة"}</div>
                    <div>{Language === "en" ? "Permissions" : "الصلاحيات"}</div>
                    <div>{Language === "en" ? "Phone" : "الهاتف"}</div>
                    <div>{Language === "en" ? "Created" : "تاريخ الإنشاء"}</div>
                    <div></div> {/* Empty for actions column */}
                    {/* <div>Hotel</div> */}
                    <div></div>
                </Table.Header>

                <Table.Body
                    data={Users?.data?.users}
                    isLoading={isLoading}
                    render={(user: any) => {
                        return (
                            <UserRow
                                User={{ ...user }}
                                key={user.id}
                            />
                        );
                    }}
                />
                  {/* <Table.Footer> */}
                    {/* <Pagination count={Users?.length??0} /> */}
                {/* </Table.Footer> */}
            </Table>
        </Menus>
    );
}
