import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStorageItemsAtCritical} from "@/services/apiStorage";
export default function useGetItemsAtCritical() {

    const {
        isLoading,
        data: StorageItems,
        error,
    } = useQuery({
        queryKey: ["StorageItemsCritical"],
        queryFn: () => getStorageItemsAtCritical(),
        retry: false,
    });

    return { isLoading, error, StorageItems };
}
