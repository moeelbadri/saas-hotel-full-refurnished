import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getOccupancyForCabins } from "@/services/apiStatistics";

export default function useGetOccupancyForCabins(id?:any,month?:any,last?:any,label?:any) {
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ['getOccupancyForCabins',id,month,last,label],
        queryFn: () => getOccupancyForCabins(id,month,last,label),
        // enabled  : label == "Occupancy" ? false : true,
        retry: false,
    });

    
    return { isLoading, error, data };
}

