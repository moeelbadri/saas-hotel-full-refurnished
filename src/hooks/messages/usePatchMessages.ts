import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { patchMarkAsRead } from "@/services/apiMessages";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function usePatchMessages() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: PatchMessages, status } = useMutation({
        mutationFn: patchMarkAsRead,
        onMutate: () => {
            toast.promise(Tpromise, {
                loading: Language==="en"?"Updating Messages...":"جاري تحديث الرسائل...",
                success: Language==="en"?"Messages successfully edited/inserted":"تم تعديل/اضافة الرسائل بنجاح",
                error: (err: { message: string }) => Language==="en" ? `Failed to update Messages : ${err.message}` : `فشل تحديث الرسائل : ${err.message}`,
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
    const isPatching = status === "pending";
    return { isPatching, PatchMessages, Tpromise };
}
export default usePatchMessages;
