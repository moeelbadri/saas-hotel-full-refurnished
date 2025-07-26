import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { putAlerts} from "../../services/apiSettings";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useUpdateHotel() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: PutAlerts, status } = useMutation({
        mutationFn: putAlerts,
        onMutate: () => {
            toast.promise(Tpromise, {
                loading: Language==="en"?"Updating Alerts...":"جاري تحديث التنبيهات...",
                success: Language==="en"?"Alerts successfully edited/inserted":"تم تعديل/اضافة التنبيهات بنجاح",
                error: (err: { message: string }) => Language==="en" ? `Failed to update Alerts : ${err.message}` : `فشل تحديث التنبيهات : ${err.message}`,
            });
        },
        onSuccess: () => {
            promise.resolve();
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["Alerts"],exact:false,refetchType:"active" });
        },
        onError: (err: { message: string }) => {
            promise.reject(err.message);
        },
    });
    const isPutting = status === "pending";
    return { isPutting, PutAlerts, Tpromise };
}
export default useUpdateHotel;
