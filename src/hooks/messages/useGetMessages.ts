"use client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getMessages } from "@/services/apiMessages";
export default function useGetMessages() {
    const {
        isLoading,
        data: Messages,
        error,
        refetch
    } = useQuery({
        queryKey: ["Messages"],
        queryFn: getMessages,
        retry: false,        
    });

    return { isLoading, error, refetch, Messages };
}
