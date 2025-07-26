import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDrinks} from "@/services/apiStorage";
export default function useGetDrinks() {

    const {
        isLoading,
        data: drinks,
        error,
    } = useQuery({
        queryKey: ["StorageDrinks"],
        queryFn: () => getDrinks(),
        retry: false,
    });

    return { isLoading, error, drinks };
}
