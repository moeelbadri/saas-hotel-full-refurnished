"use client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/apiNotifications";
export default function useGetNotifications() {
    const {
        isLoading,
        data: Notifications,
        error,
        refetch
    } = useQuery({
        queryKey: ["Notifications"],
        queryFn: getNotifications,
        retry: false,        
    });

    return { isLoading, error, refetch, Notifications };
}
