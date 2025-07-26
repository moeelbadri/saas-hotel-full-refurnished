import { createEditBooking } from "@/services/apiBookings";
import { Booking } from "@/utils/types";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient,QueryCache } from "@tanstack/react-query";
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useRouter } from "next/navigation";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useCreateBooking() {
    const Language = useSettingsStore(state => state.Language);
    const queryClient = useQueryClient();
    const router = useRouter();
    
    const { mutate, status } = useMutation({
        mutationFn: ({familyMembers,familyKids,orderSummary,booking_activity}: {familyMembers: any[],familyKids: any[],orderSummary: any,booking_activity: any[]}) => 
            createEditBooking(familyMembers,familyKids,orderSummary,booking_activity),
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Creating booking in progress... " : "جاري انشاء الحجز...",
                success :Language==="en"?`New Booking successfully created`:`تم انشاء حجز جديد بنجاح`,
                error : Language==="en"?"There was an error while creating booking":"حدث خطأ اثناء انشاء الحجز"
            })
        },
        onSuccess: (data) => {
            promise.resolve(data);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["booking"] ,exact:false,type:"active" });
            router.push("/bookings");
        },
        onError: (err: { message: string }) => {
            promise.reject();
            toast.error(err.message);
        },
    });
    const isLoading = status === "pending";
    return {
        createBooking: mutate,
        isCreating: isLoading,
        Tpromise,
    };
}

export default useCreateBooking;
