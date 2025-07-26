import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getBooking } from "@/services/apiBookings";

export default function useBooking() {
    const { id } = useParams();

    const {
        isLoading,
        data: booking,
        error,
    } = useQuery({
        queryKey: ["booking", id],
        queryFn: () => getBooking(id),
        retry: false,
    });

    return { isLoading, error, booking };
}
