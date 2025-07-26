import { createEditGuest } from "@/services/apiGuests";
import { Guest } from "@/utils/types";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsStore } from "@/components/WizardForm/useStore";

function useCreateGuest() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    const { mutate, isLoading } = useMutation({
        mutationFn: (newGuestData: Guest) => createEditGuest(newGuestData),
        onSuccess: () => {
            toast.success(Language==="en"?"New Guest successfully created":"تم انشاء زائر جديد بنجاح");
            queryClient.invalidateQueries({ queryKey: ["guests"], exact: false, refetchType: "active" });
        },
        onError: (err: { message: string }) => toast.error(err.message),
    });

    return {
        createGuest: mutate,
        isCreating: isLoading,
    };
}

export default useCreateGuest;
