import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getGuestsByGuestP } from "@/services/apiGuests";

export default function useGetGuestsByGuestP(input:string | number,adult:boolean) {
    const queryClient = useQueryClient();

    // QUERY
    const { isLoading, data, error } =  useQuery({
        queryKey: [`guests`,adult , input],
        queryFn: async() => {return await getGuestsByGuestP(input,adult)},
        retry: false,
        enabled:!!input
    });

    if (!isLoading && data) {
        queryClient.setQueryData(["guests", input], data);
    }

    return { isLoading, error, guests: data };
    
}
