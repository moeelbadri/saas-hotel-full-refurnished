import { useQuery } from "@tanstack/react-query";
import { getHotels } from "@/services/apiAuth";

export default function useGetHotels() {
    const {
        isLoading,
        data: hotels,
        error,
    } = useQuery({
        queryKey: ['getHotels',],
        queryFn: () => getHotels(),
        retry: false,
    });

    return { isLoading, error, hotels };
}