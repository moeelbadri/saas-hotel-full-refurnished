"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "@/services/apiBookings";
import { useSearchParams } from "next/navigation";
import { PAGE_SIZE } from "@/utils/constants";
export default function useBookings() {
    const queryClient = useQueryClient();
    
    const searchParams = useSearchParams();

    // FILTER
    const filter = searchParams.get("status");

    // SORT
    const sortByRaw = searchParams.get("sortBy") || "created_at-desc";
    const [sort, order] = sortByRaw.split("-");

    // PAGINATION
    const limit = searchParams.get("limit");

    //pageid 
    const pageid = searchParams.get("pageid");
    // QUERY
    const {
        isLoading,
        data : bookings,
        error,
    } = useQuery({
        queryKey: ["booking", filter, sort, order,pageid, limit],
        queryFn: () => getBookings({ filter, sort, order,pageid, limit }),
    });

    // PRE-FETCHING
    // if (page < pageCount)
    //     queryClient.prefetchQuery({
    //         queryKey: ["booking", filter, sort, order, page + 1],
    //         queryFn: () => getBookings({ filter, sort, order, page: page + 1 }),
    //     });

    // if (page > 1)
    //     queryClient.prefetchQuery({
    //         queryKey: ["booking", filter, sort, order, page - 1],
    //         queryFn: () => getBookings({ filter, sort, order, page: page - 1 }),
    //     });


    return { isLoading, error, bookings };
}
