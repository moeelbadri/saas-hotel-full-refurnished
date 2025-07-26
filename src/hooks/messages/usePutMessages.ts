import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { putMessages } from "@/services/apiMessages";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function usePutMessages() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: PutMessages, status } = useMutation({
        mutationFn: putMessages,
        onMutate: () => {
            toast.promise(Tpromise, {
                loading: Language==="en"?"Updating Messages...":"جاري تحديث التنبيهات...",
                success: Language==="en"?"Messages successfully edited/inserted":"تم تعديل/اضافة التنبيهات بنجاح",
                error: (err: { message: string }) => Language==="en" ? `Failed to update Messages : ${err.message}` : `فشل تحديث التنبيهات : ${err.message}`,
            });
        },
        onSuccess: () => {
            promise.resolve();
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["Messages"],exact:false,refetchType:"active" });
        },
        onError: (err: { message: string }) => {
            promise.reject(err.message);
        },
    });
    const isPutting = status === "pending";
    return { isPutting, PutMessages, Tpromise };
}
export default usePutMessages;
