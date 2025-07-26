"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllDiscounts } from "@/services/apiDiscounts";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function useGetAvailableDiscount() {
    const searchParams = useSearchParams();
      // SORT
      const sortByRaw = searchParams.get("sortBy") || "id-desc";
      const [field, direction] = sortByRaw.split("-");
      const sortBy = { field, direction };

    // QUERY
    const {
        isLoading,
        data: discounts,
        error,
    } = useQuery({
        queryKey: ["discounts", field, direction],
        queryFn: () =>getAllDiscounts(sortBy),
        retry: false,
    });
    // toast.success(`خصومات ${discounts?.data?.discounts?.[0].Description ?? ""} متاحة الان! `);
    return { isLoading, error, discounts };
}
