"use client";

import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { getBookingsAfterDate } from "@/services/apiBookings";

export default function useRecentBookings() {
  // Next.js App Router: read-only searchParams
  const searchParams = useSearchParams();

  // Fallback to 1 if "last" is not present
  const numDaysParam = searchParams.get("last");
  const numDays = numDaysParam ? parseInt(numDaysParam, 10) : 1;

  // Calculate the date numDays before now
  const queryDate = subDays(new Date(), numDays).toISOString();

  const { isLoading, data: bookings } = useQuery({
    queryKey: ["booking", `last-${numDays}`],
    queryFn: () => getBookingsAfterDate(queryDate),
  });

  return { isLoading, bookings };
}
