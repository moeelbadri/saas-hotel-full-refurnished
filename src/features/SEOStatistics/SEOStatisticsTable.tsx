"use client";

import { useGetSEO } from "@/hooks/bookings";
import { Menus, Spinner } from "@/components/ui";
import { SEORow } from ".";
import { useSearchParams } from "next/navigation";
import { Table } from "@/components/ui";
import { useState,useEffect } from "react";
import { useSettingsStore } from "@/components/WizardForm/useStore";

function SEOTable() {
    
    const Language = useSettingsStore(state => state.Language);
    const [searchParams] = useSearchParams("");

    const { isLoading,error,SEO } = useGetSEO(searchParams.get("hotel")==="true"?1:0,searchParams.get("group")==="true"?true:false);
     
    
    if (isLoading) return <Spinner />;

    // useEffect(() => {
    //     // if(searchParams.get("group")!==null){
    //    //           setGroupBY(searchParams.get("group")==="true"?true:false)
    //     //         console.log("hi")
    //     // }
    // },[searchParams])
    
    // 1) FILTER
    // const filterValue = searchParams.get("group") || false;
    // console.log(filterValue)

    // setGroupBY(filterValue);

    // let filteredSEOs;
    // if (filterValue === "all") filteredCabins = cabins;
    // if (filterValue === "no-discount")
    //     filteredCabins = cabins?.filter((cabin) => cabin.discount === 0);
    // if (filterValue === "with-discount")
    //     filteredCabins = cabins?.filter((cabin) => cabin.discount > 0);

    // // 2) SORT
    // const sortBy = searchParams.get("sortBy") || "startDate-asc";
    // const [field, direction] = sortBy.split("-");
    // const modifier = direction === "asc" ? 1 : -1;
    // const sortedCabins = filteredCabins?.sort(
    //     (a, b) => (a[field] - b[field]) * modifier
    // );

    return (
        <Menus>
            <Table columns="0.7fr 1.8fr 2.0fr 0.5fr 1fr 1fr 0.301fr ">
                <Table.Header>
                    <div>{Language==="en"?"country Flag":"شعار الدولة"}</div>
                    <div>{searchParams.get("group")==="true"?(Language==="en"?"City":"المدينة"):(Language==="en"?"Country":"الدولة")}</div>
                    <div>{Language==="en"?"Total Bookings":"اجمالي الحجوزات"}</div>
                    <div>{Language==="en"?"Revenue":"الايرادات"}</div>
                    {/* <div>Hotel</div> */}
                    <div></div>
                </Table.Header>

                <Table.Body
                    isLoading={isLoading}
                    data={SEO}
                    render={(seo:any) => {
                        // let discounted = cabin.regularPrice -   (cabin.regularPrice*(cabin.discount / 100));
                        return (
                            <SEORow
                            data={{ ...seo }}
                                key={seo.total_revenue}
                            />
                        );
                    }}
                />
            </Table>
        </Menus>
    );
}

export default SEOTable;
