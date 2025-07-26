
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/apiAuth";

export default function useGetUsers() {
    const {
        isLoading,
        data: Users,
        error,
    } = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers(),
        retry: false,
    });

    return { isLoading, error, Users };
}