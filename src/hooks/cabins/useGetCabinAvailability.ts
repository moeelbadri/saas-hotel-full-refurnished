import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCabinAvailability } from "@/services/apiCabins";
export default function useGetCabinAvailability(id:number,start_date:string,end_date:string,discount:any) {
    const {
        isLoading,
        data,
        fetchStatus,
        error,
    } = useQuery({
        queryKey: ["getCabinAvailability",id,start_date,end_date],
        queryFn: () => getCabinAvailability(id,start_date,end_date,discount),
        retry: false,
    });

    return { isLoading, error, fetchStatus ,data };
}