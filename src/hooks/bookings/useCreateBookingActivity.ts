import { CreateBookingActivity } from "@/services/apiBookings";
import { Booking } from "@/utils/types";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useCreateBookingActivity() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate, status } = useMutation({
        mutationFn: ({BookingId,Info,Price}: {BookingId:number;Info:string;Price:number;}) => CreateBookingActivity(BookingId,Info,Price),
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Creating booking activity in progress... " : "جاري انشاء حركة الحجز...",
                success : Language==="en"?`Booking activity successfully created`:`تم انشاء حركة جديد بنجاح`,
                error : Language==="en"?"There was an error while creating booking activity":"حدث خطأ اثناء انشاء حركة الحجز"
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
        createBookingActivity: mutate,
        isEditing: isLoading,
        Tpromise,
    };
}