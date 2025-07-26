import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getRevenuePerBookings } from "@/services/apiStatistics";
export default function useGetRevenuePerBookings(id?:any,month?:any,last?:any,label?:any) {
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ['getRevenueByBookings',id,month,last,label],
        queryFn: () => getRevenuePerBookings(id,month,last,label),
        retry: false,
    });

    return { isLoading, error, data };
}
