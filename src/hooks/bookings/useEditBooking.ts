import { createEditBooking } from "@/services/apiBookings";
import { Booking } from "@/utils/types";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useEditBooking() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate, status } = useMutation({
        // mutationFn: ({
        //     BookingData,
        //     BookingId,
        // }: {
        //     BookingData: Booking;
        //     BookingId: number;
        // }) => console.log(),
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Editing booking in progress... " : "جاري تعديل الحجز...",
                success : Language==="en"?`Booking successfully edited`:`تم تعديل الحجز بنجاح`,
                error : Language==="en"?"There was an error while editing booking":"حدث خطأ اثناء تعديل الحجز"
            })
        },
        onSuccess: (data) => {
            promise.resolve(data);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["booking"] ,exact: false, refetchType: "active"});
        },
        onError: (err: { message: string }) => {
            promise.reject();
            toast.error(err.message);
        },
    });

    const isLoading = status === "pending";
    return {
        editBooking: mutate,
        isEditing: isLoading,
        Tpromise,
    };
}

export default useEditBooking;
