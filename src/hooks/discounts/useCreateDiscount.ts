import { createEditDiscount } from "@/services/apiDiscounts";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useCreateDiscount() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate, status } = useMutation({
        mutationFn : createEditDiscount,
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Creating discount in progress... " : "جاري انشاء التخفيض...",
                success : Language==="en"?`New Discount successfully created`:`تم انشاء تخفيض جديد بنجاح`,
                error : Language==="en"?"There was an error while creating discount":"حدث خطأ اثناء انشاء التخفيض"
            })
        },
        onSuccess: (data) => {
            promise.resolve(data);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
        },
        onError: (err: { message: string }) => {
            promise.reject();
            toast.error(err.message);
        },
    });
    const isLoading = status === "pending";
    return {
        createDiscount: mutate,
        isCreating: isLoading,
        Tpromise,
    };
}

export default useCreateDiscount;
