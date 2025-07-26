"use client";

import { Cabin } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { getCabins } from "@/services/apiCabins";
import { useSearchParams } from "next/navigation";
export default function useCabins()  {
  const searchParams = useSearchParams(); // Next.js read-only searchParams

  // Get 'page' param or default to init_page
  const pageid = searchParams.get("pageid");
  const limit = searchParams.get("limit");
  const filter = searchParams.get("filter");
   // SORT
  const sortByRaw = searchParams.get("sortBy") || "created_at-desc";
  const [sort, order] = sortByRaw.split("-");
  const {
    isLoading,
    data : cabins,
    error,
  } = useQuery({
    queryKey: ["cabins", pageid, limit, sort, order,filter],
    queryFn: () => getCabins(pageid, limit, sort, order,filter),
  });
  return { isLoading, cabins , error };
}
