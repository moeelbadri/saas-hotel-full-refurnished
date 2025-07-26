import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkInOut } from "@/services/apiBookings";
import { toast } from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useCheckout() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: checkout, status } = useMutation({
        mutationFn: (bookingId : any) => checkInOut("check_out",bookingId),
         onMutate:(e)=>{
              toast.promise(Tpromise,{
                loading : Language==="en"?"Checkin in progress... " : "جاري تسجيل الدخول...",
                success : (data:any)=> Language==="en"?`Booking #${data.id} successfully checked in`:`تم الحجز #${data.id} بنجاح`,
                error : Language==="en"?"There was an error while checking in":"حدث خطأ اثناء الحجز"
              })
         },
         onSuccess: (data) => {
            promise.resolve(data?.data?.bookings);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["booking"] ,exact: false, refetchType: "active"});
        },

        onError: () => toast.error(Language==="en"?"There was an error while checking out":"حدث خطأ اثناء الخروج"),
    });
    const isCheckingOut = status === "pending";
    return { checkout, isCheckingOut, Tpromise };
}
