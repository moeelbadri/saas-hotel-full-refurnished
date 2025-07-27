"use client;"
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/apiAuth";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getAuthCookie() {
    return document.cookie
    .split(";")
    .find(c => c.trim().startsWith("auth="))
    ?.split("=")?.[1];
}
export default function useUser() {
     const pathname = usePathname()
    const { isLoading, data, error,refetch} = useQuery({
        queryKey: ["userProfile"],
        queryFn: getProfile,
        retry: false,
        enabled: getAuthCookie() !== undefined && pathname !== "/login" , // Only run if auth cookie is present and not on login page
        // gcTime:0,
    });
    return { isLoading,refetch,error,owner: data?.data?.profile?.is_owner,permissions: data?.data?.profile?.permissions };
}
