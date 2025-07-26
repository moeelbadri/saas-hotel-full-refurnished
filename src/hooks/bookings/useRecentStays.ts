"use client";

import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { getStaysAfterDate } from "@/services/apiBookings";

export default function useRecentStays() {
  // Next.js App Router hook (read-only search newParams)
  const searchParams = useSearchParams();

  // Get the "last" parameter or default to 1
  const numDaysParam = searchParams.get("last");
  const numDays = numDaysParam ? parseInt(numDaysParam, 10) : 1;

  // Compute the ISO date from numDays ago
  const queryDate = subDays(new Date(), numDays).toISOString();

  const { isLoading, data: stays } = useQuery({
    queryKey: ["stays", `last-${numDays}`],
    queryFn: () => getStaysAfterDate(queryDate),
  });

  // Filter for paid (confirmed) stays
  const confirmedStays = stays?.data.bookings?.filter((stay) => stay.is_paid === true);

  return { isLoading, stays, confirmedStays, numDays };
}
