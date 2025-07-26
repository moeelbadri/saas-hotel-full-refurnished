"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStorageReportsWithUsers } from "@/services/apiReports";
import { useSearchParams } from "next/navigation";
export default function useGetStorageReportsWithUsers() {
    const searchParams = useSearchParams();
    const days = searchParams.get("days");
    const sortbyReport = searchParams.get("sortbyReport");
    const page = searchParams.get("pageid");
    const limit = searchParams.get("limit");
    const itemId = searchParams.get("itemId");
    const {
        isLoading,
        data: StorageReportsUsers,
        error,
    } = useQuery({
        queryKey: ["StorageReportsWithUsers",days,sortbyReport,limit,page,itemId ],
        queryFn: () => getStorageReportsWithUsers(itemId,days,sortbyReport,page,limit),
        retry: false,
    });
    return { isLoading, error, StorageReportsUsers };
}
