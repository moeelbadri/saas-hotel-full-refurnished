import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/apiAuth";

export default function useUser() {
    const { isLoading, data, error } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getProfile,
        retry: true,
        gcTime:0,
    });
    return { isLoading,data,error,owner: data?.data?.profile?.is_owner,permissions: data?.data?.profile?.permissions };
}
