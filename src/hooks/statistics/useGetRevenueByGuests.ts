import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getRevenueByGuests } from "@/services/apiStatistics";
export default function useGetRevenueByGuests() {
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ['getRevenueByGuests'],
        queryFn: () => getRevenueByGuests(),
        retry: false,
    });

    return { isLoading, error, data };
}
