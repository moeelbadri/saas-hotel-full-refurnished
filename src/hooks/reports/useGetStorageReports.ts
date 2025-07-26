"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStorageReports } from "@/services/apiReports";
import { useSearchParams } from "next/navigation";
export default function useGetStorageReports() {
    const searchParams = useSearchParams();
    const {
        isLoading,
        data: StorageReports,
        error,
    } = useQuery({
        queryKey: ["StorageReports",searchParams.get("days"),searchParams.get("sortbyReport"),searchParams.get("itemId") ],
        queryFn: () => getStorageReports(searchParams.get("itemId"),searchParams.get("days"),searchParams.get("sortbyReport")),
        retry: false,
    });

    return { isLoading, error, StorageReports };
}
