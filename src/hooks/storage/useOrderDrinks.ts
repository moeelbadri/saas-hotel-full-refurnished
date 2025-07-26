//deleteDrinks
import { orderDrinks} from "@/services/apiStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useOrderDrinks() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);

    const { mutate, status } = useMutation({ 
        mutationFn : (data:any) => orderDrinks(data.item, data.quantity, data.bookingId),
        onMutate: (data) => {

            toast.promise(Tpromise, {
                loading: Language === "en" ? "Ordering ..." : "جاري الطلب ...",
                success:Language === "en" ? `Order has been successfully added` : `تمت اضافة الطلب بنجاح`,
                error: Language === "en" ? "There was an error while adding the order" : "حدث خطأ اثناء اضافة الطلب",
            })
        },
        onSuccess: () => {
            promise.resolve();
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["storage"],exact:false,refetchType:"active" });
            queryClient.invalidateQueries({ queryKey: ["booking"],exact:false,refetchType:"active" });
            queryClient.invalidateQueries({ queryKey: ["bookings"],exact:false,refetchType:"active" });
        },
        onError: (err: { message: string }) => {
            toast.error(err.message);
        },
    });

    const isLoading = status === "pending";
    return {
        orderDrinks: mutate,
        isLoading,
        Tpromise,
    };
        }

export { useOrderDrinks };