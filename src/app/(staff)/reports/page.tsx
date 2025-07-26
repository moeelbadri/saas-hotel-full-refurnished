// import DashboardLayout from "../features/dashboard/DashboardLayout";
"use client";
import { Row } from "@/components/layout";
import { Heading } from "@/components/typography";
import ReportsLayout from "@/features/reports/ReportsLayout";
import ReportFilter from "@/features/reports/ReportFilter";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { Select, SpinnerMini } from "@/components/ui";
import { useGetStorageItems } from "@/hooks/storage";
import { useGetStorageActivities } from "@/hooks/storage";
import useDarkMode from "@/hooks/useDarkMode";
import { useEffect, useState } from "react";
import { useGetStorageReports } from "@/hooks/reports";
import { useRouter,useSearchParams } from "next/navigation";
function Reports() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const Language = useSettingsStore(state => state.Language);
    const { isDarkMode } = useDarkMode();
    const { StorageItems, error, isLoading } = useGetStorageItems();
    const [Loading,SetLoading]=useState(false)
    useEffect(function(){
        SetLoading(true);
        setTimeout(()=>{SetLoading(false)},0)
    },[Language,searchParams,StorageItems])
    const {} = useGetStorageReports();
    return (
        <>
            <Row>
                <Heading as="h1">
                    {Language === "en" ? "Reports" : "تقارير"}
                </Heading>
                {isLoading||Loading ? (
                    <SpinnerMini />
                ) : (
                    <Select
                        isDarkMode={isDarkMode}
                        defaultValue = {() => {
                            if (StorageItems && StorageItems.length > 0) {
                                const item = StorageItems.find((item: any) => item.value === searchParams.get("itemId"));
                                return item ? { label: item.arlabel?Language==="en"?item.label:item.arlabel:item.label, value: item.value } : null;
                            }
                            return null; // or handle the undefined case as needed
                        }}
                        data={StorageItems?.map((item: any) => ({
                            label: item.arlabel?Language==="en"?item.label:item.arlabel:item.label,
                            value: item.value,
                        })
                )}
                        placeholder={
                            Language === "en" ? "Select Item" : "حدد العنصر"
                        }
                        onChange={(e: any) => {
                            const newParams = new URLSearchParams(searchParams.toString());
                            newParams.set("itemId", e.value ?? ""); // Change or add query
                            router.replace(`${window.location.pathname}?${newParams.toString()}`);
                        }}
                    ></Select>
                )}
                <ReportFilter />
            </Row>
            <ReportsLayout />
        </>
    );
}

export default Reports;
