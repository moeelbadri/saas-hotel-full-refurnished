//getCabinsAndCategories
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getCabinsAndCategories } from "@/services/apiStatistics";
export default function useGetCabinsAndCategories() {
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ['getCabinsAndCategories'],
        queryFn: () => getCabinsAndCategories(),
        retry: false,
    });

    return { isLoading, error, data };
}
