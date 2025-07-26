"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { PAGE_SIZE } from "@/utils/constants";
import { getGuests } from "@/services/apiGuests";
import { useFieldArray } from "react-hook-form";

export default function useGuests() {
    const queryClient = useQueryClient();
    const searchParams = useSearchParams();

    // SearchBy
    const SearchValue = searchParams.get("SearchBy")||"";
    // const searchBy = {useFieldArray:(typeof SearchValue === "string" && /^\d/.test(SearchValue))?"nationalID":"fullName",value:SearchValue}
    const search = SearchValue;
    // { useFieldArray: "nationalID", value: 12312312 };

    // SORT
    const sortByRaw = searchParams.get("sortBy") || "last_booking-desc";
    const [sort, order] = sortByRaw.split("-");


    // PAGINATION
    const page = !searchParams.get("page")
        ? 1
        : Number(searchParams.get("page"));
    
    // PAGE SIZE
    const limit = !searchParams.get("limit")
        ? PAGE_SIZE
        : Number(searchParams.get("limit"));
        
    // QUERY
    const {
        isLoading,
        data:guests,
        error,
    } = useQuery({
        queryKey: ["guests", search, sort, order, page , limit],
        queryFn: () => getGuests({ search, sort , order, page , limit }),
    });

    // // PRE-FETCHING
    // const pageCount = Math.ceil(count / PAGE_SIZE);

    // if (page < pageCount)
    //     queryClient.prefetchQuery({
    //         queryKey: ["guests", searchBy, sortBy, page + 1 , pageSize],
    //         queryFn: () => getGuests({ searchBy, sortBy, page: page + 1 , pageSize}),
    //     });

    // if (page > 1)
    //     queryClient.prefetchQuery({
    //         queryKey: ["guests", searchBy, sortBy, page - 1, pageSize],
    //         queryFn: () => getGuests({ searchBy, sortBy, page: page - 1 , pageSize}),
    //     });

    return { isLoading, error, guests };
}
