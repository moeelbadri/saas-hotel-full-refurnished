"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAlerts } from "@/services/apiSettings";
export default function useGetAlerts(all:boolean = false) {
    const searchParams = useSearchParams();

    // SearchBy
    // const SearchValue = searchParams.get("SearchBy")||"";
    // let searchBy = {field:(typeof SearchValue === "string" && /^\d/.test(SearchValue))?"nationalID":"fullName",value:SearchValue}

    // { field: "nationalID", value: 12312312 };

    // SORT
    const sortByRaw = searchParams.get("sortBy") || "created_at-desc";
    const [field, direction] = sortByRaw.split("-");
    
    const { isLoading:isgettingAlerts, data:GetAlerts, error } = useQuery({
        queryKey: ["Alerts",field, direction,all],
        queryFn: () => getAlerts(field, direction,all),
        retry: false,
    });
    return { isgettingAlerts, GetAlerts, error };
}