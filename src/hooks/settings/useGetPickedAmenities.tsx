
import { getPickedAmenities } from "../../services/apiSettings";
import { useQuery } from "@tanstack/react-query";
export default function useGetPickedAmenities(days?:any,discounts?:any,startdate?:any,enddate?:any) {
    const { isLoading:isgettingPicked, data:GetPickedAmenities, error } = useQuery({
        queryKey: ["getPickedAmenities"],
        queryFn: () => getPickedAmenities(days,discounts,startdate,enddate),
        retry: false,
    });
    return { isgettingPicked, GetPickedAmenities, error };
}