import { createEditDiscount } from "@/services/apiDiscounts";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useEditDiscount() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate, status } = useMutation({
        mutationFn:createEditDiscount,
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Editing discount in progress... " : "جاري تعديل التخفيض...",
                success : Language==="en"?`Discount successfully edited`:`تم تعديل التخفيض بنجاح`,
                error : Language==="en"?"There was an error while editing discount":"حدث خطأ اثناء تعديل التخفيض"
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
        editDiscount: mutate,
        isEditing: isLoading,
        Tpromise,
    };
}

export default useEditDiscount;
