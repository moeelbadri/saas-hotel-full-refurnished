//getStorageItemsCategories
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStorageItemsCategories} from "@/services/apiStorage";
export default function useGetStorageItemsCategories() {

    const {
        isLoading,
        data: StorageItemsCategories,
        error,
    } = useQuery({
        queryKey: ["StorageItemsCategories"],
        queryFn: () => getStorageItemsCategories(),
        retry: false,
    });

    return { isLoading, error, StorageItemsCategories };
}
