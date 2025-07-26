"use client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getAnnouncements, getMessages } from "@/services/apiMessages";
export default function useGetAnnouncements() {
    const {
        isLoading,
        data: Announcements,
        error,
        refetch
    } = useQuery({
        queryKey: ["Announcements"],
        queryFn: getAnnouncements,
        retry: false,        
    });

    return { isLoading, error, refetch, Announcements };
}
