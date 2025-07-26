import { extendBooking } from "@/services/apiBookings";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useExtendBooking() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate, status } = useMutation({
        mutationFn: (data:any) => extendBooking(data),
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Extending booking in progress... " : "جاري تمديد الحجز...",
                success : Language==="en"?`Booking Extended successfully`:`تم تمديد الحجز بنجاح`,
                error : Language==="en"?"There was an error while extending booking":"حدث خطأ اثناء تمديد الحجز"
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
        mutate,
        isLoading,
        Tpromise,
    };
}