"use client";
import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import { getStorageActivities} from "@/services/apiStorage";
import { useSearchParams } from "next/navigation";
export default function useGetStorageActivities() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const pageid = searchParams.get("pageid");
    const limit = searchParams.get("limit");
    const {
        isLoading,
        data: StorageItems,
        error,
    } = useQuery({
        queryKey: ["StorageActivties",id,pageid,limit],
        queryFn: () => getStorageActivities(id,pageid,limit),
        retry: false,
    });

    return { isLoading, error, StorageItems };
}