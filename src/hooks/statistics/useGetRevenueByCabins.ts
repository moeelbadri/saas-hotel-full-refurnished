import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getRevenueByCabins } from "@/services/apiStatistics";
export default function useGetRevenueByCabins() {
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ['getRevenueByCabins'],
        queryFn: () => getRevenueByCabins(),
        retry: false,
    });

    return { isLoading, error, data };
}
