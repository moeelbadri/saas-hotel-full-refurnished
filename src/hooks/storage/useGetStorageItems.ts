import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStorageItems} from "@/services/apiStorage";
export default function useGetStorageItems() {

    const {
        isLoading,
        data: StorageItems,
        error,
    } = useQuery({
        queryKey: ["StorageItems"],
        queryFn: () => getStorageItems(),
        retry: false,
    });

    return { isLoading, error, StorageItems };
}
