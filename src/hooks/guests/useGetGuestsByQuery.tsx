import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getGuestsByQuery } from "@/services/apiGuests";

export default function useGetGuestsByQuery() {
    // QUERY
        const {
            isLoading,
            data:guests,
            error,
        } = useQuery({
            queryKey: ["guestsQuery"],
            queryFn: () => getGuestsByQuery,
        });
    return { isLoading, error, guests };
}