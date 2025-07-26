import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getGuestById } from "@/services/apiGuests";
import { useSearchParams } from "next/navigation";

export default function useGetGuestById() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    // QUERY
        const {
            isLoading,
            data:guest,
            error,
        } = useQuery({
            queryKey: ["guests", id],
            queryFn: () => getGuestById,
        });
    return { isLoading, error, guest };
}