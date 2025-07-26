import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { putAmenities } from "../../services/apiSettings";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function usePutAmenities() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: updateAmenities, status} = useMutation({
        mutationFn: putAmenities,
        onMutate: () => {
            toast.promise(Tpromise, {
                loading: Language === "en" ? "Updating amenities..." : "جاري تحديث الخدمات...",
                success: Language === "en" ? "Amenities updated successfully!" : "تم تحديث الخدمات بنجاح",
                error:  (error) => Language==="en"?`Failed to update amenities : ${error.message}`:`فشل في تحديث الخدمات : ${error.message}`
            });
        },
        onSuccess: () => {
            promise.resolve(true)
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["getPickedAmenities"] });
        },
        onError: (err: { message: string }) => toast.error(err.message),
    });
    const isUpdatingAmenities = status === "pending";
    return { isUpdatingAmenities, updateAmenities, Tpromise };
}
export default usePutAmenities;
