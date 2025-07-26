import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDiscounts } from "@/services/apiDiscounts";
import { toast } from "react-hot-toast";

export default function useGetAvailableDiscount() {
    const {
        isLoading,
        data: discounts,
        error,
    } = useQuery({
        queryKey: ["discounts"],
        queryFn: () =>getDiscounts(),
        retry: false,
    });
//    (discounts??[]).length> 0 && toast.success(`خصومات ${discounts?.[0].Description} متاحة الان! `);
    return { isLoading, error, discounts };
}
