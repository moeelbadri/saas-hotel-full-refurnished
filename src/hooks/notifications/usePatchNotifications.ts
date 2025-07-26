import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { patchMarkAsRead } from "@/services/apiNotifications";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function usePatchNotifications() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: PatchNotifications, status } = useMutation({
        mutationFn: patchMarkAsRead,
        onMutate: () => {
            toast.promise(Tpromise, {
                loading: Language==="en"?"Updating Notifications...":"جاري تحديث الرسائل...",
                success: Language==="en"?"Notifications successfully edited/inserted":"تم تعديل/اضافة الرسائل بنجاح",
                error: (err: { message: string }) => Language==="en" ? `Failed to update Notifications : ${err.message}` : `فشل تحديث الرسائل : ${err.message}`,
            });
        },
        onSuccess: () => {
            promise.resolve();
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["Notifications"],exact:false,refetchType:"active" });
        },
        onError: (err: { message: string }) => {
            promise.reject(err.message);
        },
    });
    const isPatching = status === "pending";
    return { isPatching, PatchNotifications, Tpromise };
}
export default usePatchNotifications;
