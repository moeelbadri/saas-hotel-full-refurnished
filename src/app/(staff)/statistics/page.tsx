"use client";
import { Column, Row } from "@/components/layout";
import { Heading } from "@/components/typography";
import {
    SEOStatisticsTable,
    SEOStatisticsTableOperations,
} from "@/features/SEOStatistics";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { Button, Select, Spinner, SpinnerMini } from "@/components/ui";

import {
    useGetSalesForCabins,
    useGetCabinsAndCategories,
    useGetOccupancyForCabins,
    useGetRepeatedGuests,
    useGetRevenueByGuests,
    useGetRevenuePerBookings,
    useGetRevenueByCabins,   
} from "@/hooks/statistics";
import {useBookings} from "@/hooks/bookings";
import StatisticsTable from "@/features/SEOStatistics/StatisticsTable";
import { StatisticsFilter } from "@/features/SEOStatistics";
import { useEffect, useState } from "react";
import { FormRow } from "@/components/form";
import useDarkMode from "@/hooks/useDarkMode";
import { useRouter, useSearchParams } from "next/navigation";

import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { getBookings } from "../services/apiStatistics";

const exportToExcel = (data: any, type: any, last: any, date: any) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Buffer to store the generated Excel file
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });
    const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    // saveAs(blob, `data_${type}_Last_${last ?? 1}_days_${date}.xlsx`);
};

function FlatCabinsCategory(data: any, Language: string) {
    const temp: any = [];
    data?.forEach((Category: any) => {
        temp.push({
            label:
                "Category : " +
                (Language === "en" ? Category.typeNameEn : Category.typeNameAr),
            value: "c" + Category.id,
        });
        Category.cabins.forEach((cabin: any) => {
            temp.push({ label: "Room : " + cabin.name, value: cabin.id });
        });
    });
    return temp;
}
export default function Statistics() {
    const Language = useSettingsStore(state => state.Language);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isDarkMode } = useDarkMode();


    const { data: cabinAndCategories, isLoading: isLoading4 } = useGetCabinsAndCategories();
    const { bookings, isLoading: isLoading3 } = useBookings();
    const { data: data1, isLoading: isLoading5 } = useGetSalesForCabins(
        searchParams.get("id"),
        searchParams.get("group"),
        searchParams.get("last"),
        searchParams.get("label"),
    );
    const { data: data2, isLoading: isLoading6 } = useGetOccupancyForCabins(
        searchParams.get("id"),
        searchParams.get("group"),
        searchParams.get("last"),
        searchParams.get("label"),
    );
    
    const { data: data3, isLoading: isLoading7 } = useGetRepeatedGuests();
    const { data: data4, isLoading: isLoading8 } = useGetRevenueByGuests();
    const { data: data5, isLoading: isLoading9 } = useGetRevenueByCabins();
    const { data: data6, isLoading: isLoading10 } = useGetRevenuePerBookings(
        searchParams.get("id"),
        searchParams.get("group"),
        searchParams.get("last"),
        searchParams.get("label"),
    );

    const [Loading, SetLoading] = useState(false);
    const [TableLoading, SetTableLoading] = useState(false);
    const RoomLists = [
        { value: data1, label: "Revenue"  },
        { value: data2, label: "Occupancy" },
    ];
    const BookingLists = [
        { value: data6, label: "Revenue Per Bookings"  },
    ]
    const GuestLists = [
        { value: data3, label: "Percentation of repeated guests" },
        { value: data4, label: "Revenue Per Guest" },
    ];
    const DATAList: Record<string, Record<string, any>> = {
        none: [],
        Rooms: RoomLists,
        Bookings: BookingLists,
        // Guests: GuestLists,
    };
    const [Category, setCategory] = useState<any>();
    const [option1, setOption1] = useState();
    const [option2, setOption2] = useState<any>([]);
    useEffect(
        function () {
            SetLoading(true);
            setTimeout(() => {
                SetLoading(false);
            }, 0);
            setOption2([]);
        },
        [Category]
    );
    useEffect(function () {
        SetTableLoading(true);
        setTimeout(() => {
            SetTableLoading(false);
        }, 0);
        DATAList[Category]?.forEach((item: any) => {
            if(item.label == searchParams.get("label")) setOption2(item.value);
        })
    },[data1,data2,data3,data4,data6])
    const today = new Date().toISOString().split("T")[0];
    return (
        <>
            <Row style={{ marginBottom: "2.5rem" }}>
                <Heading as="h1">
                    {Language === "en" ? "Statistics" : "احصائيات تفصيلية"}
                </Heading>
                <Button
                    style={{ float: "left" }}
                    onClick={() =>
                        exportToExcel(
                            DATAList[Category],
                            option2,
                            searchParams.get("last"),
                            today
                        )
                    }
                >
                    Export To Excel
                </Button>
                {/* <SEOStatisticsTableOperations /> */}
            </Row>
            <Row style={{ marginBottom: "2.5rem", display: "grid" }}>
                <StatisticsFilter />
            </Row>
            <FormRow label={Language === "en" ? "Category" : "التصنيف"}>
                <Select
                    data={[
                        { value: "Rooms", label: "Rooms" },
                        { value: "Bookings", label: "Bookings" },
                        { value: "Guests", label: "Guests" },
                        // { value: "Storage", label: "Storage" },
                    ]}
                    onChange={(e: any) => setCategory(e.value)}
                    isDarkMode={isDarkMode}
                ></Select>
            </FormRow>
            <FormRow label={Language === "en" ? "Item" : "العنصر"}>
                {Category && Loading ? (
                    <SpinnerMini />
                ) : (
                    <Select
                        data={
                            Category === "Rooms"?
                            [
                            { value: null, label: "All Rooms" },
                            ...FlatCabinsCategory(cabinAndCategories, Language),
                        ]:Category === "Bookings"?
                        [
                            { value: null, label: "All Bookings" },
                            ...(bookings?.data?.bookings || []),
                        ]:[]}
                        disabled={Category ? false : true}
                        isDarkMode={isDarkMode}
                        onChange={(e: any) => {
                            setOption1(e.value);
                            const newParams = new URLSearchParams(searchParams.toString());
                            newParams.set("id", e.value ?? ""); // Change or add query
                            router.replace(`${window.location.pathname}?${newParams.toString()}`);
                        }}
                    ></Select>
                )}
            </FormRow>
            <FormRow
                label={
                    Language === "en" ? "Filtering Tool" : "طريقة عرض البيانات"
                }
            >
                {Category && Loading ? (
                    <SpinnerMini />
                ) : (
                    <Select
                        data={DATAList[Category]}
                        disabled={Category ? false : true}
                        isDarkMode={isDarkMode}
                        onChange={(e: any) => {
                            setOption2(e.value)
                              const newParams = new URLSearchParams(searchParams.toString());
                            newParams.set("label", e.value ?? ""); // Change or add query
                            router.replace(`${window.location.pathname}?${newParams.toString()}`);
                        }}
                    ></Select>
                )}
            </FormRow>
            <div style={{ marginBottom: "2.5rem" }}></div>
            <StatisticsTable data={searchParams.get("label") == "" ? [] : option2 ?? []} loading={(isLoading4 || isLoading5 || isLoading6 || isLoading10 )} />
 
            {/* <Row style={{ marginBottom: "2.5rem" }}>
            {(getRolesVar().isOwner||getRolesVar().isCoOwner||getRolesVar().isStatistics) &&
            <Statistics
                bookings={bookings}
                confirmedStays={confirmedStays}
                numDays={numDays}
                cabinCount={cabins?.length}
            />}</Row> */}

            <Column style={{ marginBottom: "20.5rem" }}>
                <Column align="start"></Column>
                {/* <SEOStatisticsTable /> */}
            </Column>
        </>
    );
}
