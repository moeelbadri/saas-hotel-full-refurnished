"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookingsStats } from "@/services/apiBookings";
import { useSearchParams } from "next/navigation";

export default function useGetSEO(hotelid:any,city:boolean) {
    // const [searchParams] = useSearchParams();

    // const numDays = !searchParams.get("last")
    //     ? 7
    //     : Number(searchParams.get("last"));

    const {
        isLoading,
        data: SEO,
        error,
    } = useQuery({
        queryKey: ['useGetSEO', hotelid,city],
        queryFn: () => getBookingsStats(hotelid, city),
        retry: false,
    });

    return { isLoading, error, SEO };
}