import { useQuery } from "@tanstack/react-query";
import { getAvailableCabins } from "@/services/apiCabins";

export default function useGetAvailableCabins(startDate: Date | string, endDate: Date | string,discount: any,Categoryid: any) {
    const {
        isLoading,
        fetchStatus,
        data: cabins,
        error,
    } = useQuery({
        queryKey: ['availableCabins', startDate, endDate,Categoryid],
        queryFn: () => getAvailableCabins(startDate, endDate,discount,Categoryid),
        retry: false,
        enabled: !!endDate&&Categoryid>0,
    });

    return { isLoading, fetchStatus, error, cabins };
}

