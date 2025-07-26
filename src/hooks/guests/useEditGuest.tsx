import { createEditGuest } from "@/services/apiGuests";
import { Guest } from "@/utils/types";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsStore } from "@/components/WizardForm/useStore";

function useEditGuest() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    const { mutate, isLoading } = useMutation({
        mutationFn: ({
            GuestData,
            GuestId,
        }: {
            GuestData: Guest;
            GuestId: number;
        }) => createEditGuest(GuestData, GuestId),
        onSuccess: () => {
            toast.success(Language==="en"?"Guest successfully edited":"تم تعديل الزائر بنجاح");
            queryClient.invalidateQueries({ queryKey: ["guests"], exact: false, refetchType: "active" });
        },
        onError: (err: { message: string }) => toast.error(err.message),
    });

    return {
        editGuest: mutate,
        isEditing: isLoading,
    };
}

export default useEditGuest;
