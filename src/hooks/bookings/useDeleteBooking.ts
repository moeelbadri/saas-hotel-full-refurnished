import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteBooking as deleteBookingApi } from "@/services/apiBookings";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useDeleteBooking() {
    const Language = useSettingsStore(state => state.Language);
    const queryClient = useQueryClient();
    const {
        status,
        mutate: deleteBooking 
        } = useMutation({
        mutationFn: deleteBookingApi,
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Deleting booking in progress... " : "جاري حذف الحجز...",
                success : Language==="en"?`Booking successfully deleted`:`تم حذف الحجز بنجاح`,
                error : Language==="en"?"There was an error while deleting booking":"حدث خطأ اثناء حذف الحجز"
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

    const isDeleting = status === "pending";
    return { isDeleting, deleteBooking, Tpromise };
}
