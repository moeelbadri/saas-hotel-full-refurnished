import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getBookingCalender } from "@/services/apiBookings";
import { useBookingStore } from "@/components/WizardForm/useStore";
function isValidDate(date: Date) {
    return date instanceof Date && !isNaN(date.getTime());
  }
export default function useGetBookingCalender() {
    // const { selectedRanges } = useBookingStore();
    // const from = selectedRanges[0]?.start;
    // const fromDate = new Date(from?.year, from?.month, from?.day);
    // const to = selectedRanges?.[selectedRanges.length - 1]?.end;
    // const toDate = new Date(to?.year, to?.month, to?.day);
    // const shouldFetch = fromDate && toDate && isValidDate(fromDate) && isValidDate(toDate);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const {
        isLoading,
        data: bookings,
        error,
    } = useQuery({
        queryKey: ["bookingCalender",new Date().toISOString().split("T")[0],new Date(nextYear).toISOString().split("T")[0]],
        queryFn: () => getBookingCalender(new Date().toISOString().split("T")[0],new Date(nextYear).toISOString().split("T")[0]),
        // enabled: shouldFetch, // Only fetch if dates are valid
        retry: false,
    });

    return { isLoading, error, bookings };
}
