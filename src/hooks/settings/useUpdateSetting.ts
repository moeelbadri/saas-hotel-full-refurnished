import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateSettings as updateSettingsApi } from "../../services/apiSettings";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useUpdateSettings() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: updateSettings, status} = useMutation({
        mutationFn: updateSettingsApi,
        onMutate: () => {
            toast.promise(Tpromise, {
                loading: Language==="en"?"Updating settings...":"جاري تحديث الاعدادات...",
                success: Language==="en"?"Settings successfully edited":"تم تعديل الاعدادات بنجاح",
                error: (error) => Language==="en" ? `Failed to update settings : ${error.message}` : `فشل تحديث الاعدادات : ${error.message}`,
            });
        },
        onSuccess: () => {
            promise.resolve(true)
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: (err: { message: string }) => toast.error(err.message),
    });
    const isUpdating = status === "pending";
    return { isUpdating, updateSettings, Tpromise };
}
export default useUpdateSettings;
