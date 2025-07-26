//getAvailableCabinsByCategory
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAvailableCabinsByCategory } from "@/services/apiCabins";
export default function usegetAvailableCabinsByCategory(id:number) {
    const {
        isLoading,
        data: AvailableCabinsbyCategory,
        fetchStatus,
        error,
    } = useQuery({
        queryKey: ["AvailableCabinsbyCategory",id],
        queryFn: () => getAvailableCabinsByCategory(id),
        retry: false,
        enabled:id>0
    });

    return { isLoading, error, fetchStatus ,AvailableCabinsbyCategory };
}
