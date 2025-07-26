import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getSalesForCabins } from "@/services/apiStatistics";
export default function useGetSalesForCabins(id?:any,month?:any,last?:any,label?:any) {
    // console.log(label == "Revenue")
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ['getSalesForCabins',id,month,last,label],
        queryFn: () => getSalesForCabins(id,month,last,label),
        // enabled  : label == "Revenue" ? false : true,
        retry: false,
    });
    return { isLoading, error, data  };
}
