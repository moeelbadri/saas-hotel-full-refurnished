import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCabinsCategories } from "@/services/apiCabins";
export default function useGetCabinsCategories(active: boolean) {
    const {
        isLoading,
        data: CabinsCategories,
        error,
    } = useQuery({
        queryKey: ["CabinCategories",active],
        queryFn: () => getCabinsCategories(active),
        retry: false,
    });

    return { isLoading, error, CabinsCategories };
}
