
// import { getBreakfast } from "../../services/apiSettings";
import { useQuery } from "@tanstack/react-query";
export default function useGetBreakfast() {
    const { isLoading:isgettingBreakfast, data:GetBreakfast, error } = useQuery({
        queryKey: ["getBreakfast"],
        queryFn: () => getBreakfast(),
        retry: false,
    });
    return { isgettingBreakfast, GetBreakfast, error };
}