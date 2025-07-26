// deleteAlerts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteAlerts} from "../../services/apiSettings";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useDeleteAlerts() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: deleteAlert, isLoading: isDeleting } = useMutation({
        mutationFn: deleteAlerts,
        onMutate: () => {
            toast.promise(Tpromise, {
                loading: Language==="en"?"Deleting Alerts...":"جاري حذف التنبيهات...",
                success: Language==="en"?"Alerts successfully deleted":"تم حذف التنبيهات بنجاح",
                error: (err: { message: string }) => Language==="en" ? `Failed to delete Alerts : ${err.message}` : `فشل حذف التنبيهات : ${err.message}`,
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

    return {    isDeleting, deleteAlert, Tpromise };
}
export default useDeleteAlerts;
