import { uploadGuests } from "@/services/apiGuests";
import { Guest } from "@/utils/types";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsStore } from "@/components/WizardForm/useStore";

function usePostGuests() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    const { mutate, isLoading } = useMutation({
        mutationFn: (newGuestData: any) => uploadGuests(newGuestData),
        onSuccess: () => {
            toast.success(Language==="en"?"Guests successfully Uploaded":"تم تحميل بيانات النزلاء بنجاح");
            queryClient.invalidateQueries({ queryKey: ["guest"], exact: false, refetchType: "active" });
        },
        onError: (err: { message: string }) => toast.error(err.message),
    });

    return {
        createGuests: mutate,
        isCreating: isLoading,
    };
}

export default usePostGuests;
