"use client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/apiMessages";
export default function useGetUsers() {
    const {
        isLoading,
        data: Users,
        error,
        refetch
    } = useQuery({
        queryKey: ["profiles"],
        queryFn: getUsers,
        retry: false,        
    });

    return { isLoading, error, refetch, Users };
}
