import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateHotel} from "../../services/apiSettings";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useUpdateHotel() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: UpdateHotel, status } = useMutation({
        mutationFn: updateHotel,
        onMutate: (e) => {
            toast.promise(Tpromise, {
                loading: Language==="en"?"Updating settings...":"جاري تحديث الاعدادات...",
                success: Language==="en"?"Settings successfully edited":"تم تعديل الاعدادات بنجاح",
                error: (error) => Language==="en" ? `Failed to update settings : ${error.message}` : `فشل تحديث الاعدادات : ${error.message}`,
            });
        },
        onSuccess: () => {
            promise.resolve();
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["settings"],refetchType:"active" });
        },
        onError: (err: { message: string }) =>{
            promise.reject(err.message);
        },
    });
    const isUpdating = status === "pending";
    return { isUpdating, UpdateHotel, Tpromise };
}
export default useUpdateHotel;
