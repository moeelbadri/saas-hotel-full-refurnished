import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/apiAuth";

export default function useUser() {
    const { isLoading, data, error } = useQuery({
        queryKey: ["userData"],
        queryFn: getCurrentUser,
        retry: true,
        // cacheTime:0,
    });
    return { isLoading,data,error, isAuthenticated: data?.status === "success" };
}
