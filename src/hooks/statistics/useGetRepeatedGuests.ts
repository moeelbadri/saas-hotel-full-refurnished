import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { getRepeatedGuests } from "@/services/apiStatistics";
export default function useGetRepeatedGuests() {
    const {
        isLoading,
        data,
        error,
    } = useQuery({
        queryKey: ['getRepeatedGuests'],
        queryFn: () => getRepeatedGuests(),
        retry: false,
    });

    return { isLoading, error, data };
}
