import { useQuery } from "@tanstack/react-query";
import { getHotelUsers } from "@/services/apiAuth";

export default function useGetHotelUsers() {
    const {
        isLoading,
        data:hotelUsers,
        error,
    } = useQuery({
        queryKey: ['getHotelUsers'],
        queryFn: () => getHotelUsers(),
        retry: false,
    });

    return { isLoading, error, hotelUsers };
}