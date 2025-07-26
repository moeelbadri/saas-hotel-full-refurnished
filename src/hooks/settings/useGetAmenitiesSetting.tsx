import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getAmenities as AmenitiesApi } from "../../services/apiSettings";
export default function useGetAmenitiesSetting() {
    const {
        isLoading: isGetting,
        data: GetAmenities,
        error,
    } = useQuery({
        queryKey: ['AvailableAmenities'],
        queryFn: () => AmenitiesApi(),
        retry: false,
    });

    return { isGetting, error, GetAmenities };
}
