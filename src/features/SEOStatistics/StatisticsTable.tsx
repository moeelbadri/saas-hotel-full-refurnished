"use client";

import { Menus, SortBy, Spinner } from "@/components/ui";
import { SEORow } from ".";
import { useSearchParams } from "next/navigation";
import { Table } from "@/components/ui";
import { useSettingsStore } from "@/components/WizardForm/useStore";

export default function StatisticsTable(data?:any) {
    // console.log(data)
    const Language = useSettingsStore(state => state.Language);
    const keys = Object?.keys(data?.data?.[0]??{}); // Assuming the first object has all possible keys
    // console.log(data.loading)
    return (
        <Menus>
            <Table columns="1fr 1fr 1fr 1fr">
                <Table.Header>
                    {keys?.map((key) => (
                        <div key={key}>{Language==="en"?key:key}<SortBy sortBy={key} /></div>
                    ))}
                    <div></div>
                </Table.Header>

                <Table.Body
                    isLoading={data.loading}
                    data={data.data}
                    render={(data1:any) => {
                        // let discounted = cabin.regularPrice -   (cabin.regularPrice*(cabin.discount / 100));
                        return (
                            <SEORow
                                data={{ ...data1 }}
                                key={data1.id}
                            />
                        );
                    }}
                />
            </Table>
        </Menus>
    );
}