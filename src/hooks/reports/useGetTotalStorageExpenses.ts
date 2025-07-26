import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllStorageExpenses } from "@/services/apiReports";
import { useSearchParams } from "next/navigation";
import { ApiResponse } from "@/utils/helpers";
export default function useGetTotalStorageExpenses() {
    const searchParams = useSearchParams(); // Next.js read-only searchParams
    const {
        isLoading,
        data : StorageReportsSum,
        error,
    } = useQuery<any>({
        queryKey: ["StorageReportsSum",searchParams.get("days")],
        queryFn: () => getAllStorageExpenses(searchParams.get("days")),
        retry: false,
    });
    return { isLoading, error, StorageReportsSum };
}
