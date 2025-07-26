import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getDashboardStats } from "@/services/apiStatistics";
import { useSearchParams } from "next/navigation";
export default function useGetDashboardStats() {
        const searchParams = useSearchParams();
        const days : any = searchParams.get("last");
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ['getDashboardStats',days],
        queryFn: () => getDashboardStats(+days),
        retry: false,
    });

    return { isLoading, error, data };
}
