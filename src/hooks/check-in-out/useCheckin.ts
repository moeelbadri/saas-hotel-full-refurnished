import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkInOut } from "@/services/apiBookings";
import { toast } from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useCheckin() {
    const queryClient = useQueryClient();
    const navigate = useRouter();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: checkin, status } = useMutation({ 
      mutationFn: (bookingId : any) => checkInOut("check_in",bookingId),
        onMutate:(e) =>{
            toast.promise(Tpromise, {
              loading : Language==="en"?"Checkin in progress... " : "جاري تسجيل الدخول...",
              success : (data:any)=> Language==="en"?`Booking #${data} successfully checked in`:`تم الحجز #${data} بنجاح`,
              error : Language==="en"?"There was an error while checking in":"حدث خطأ اثناء الحجز"
            })
        },
        onSuccess: (data) => {
            promise.resolve(data?.data?.bookings?.[0]?.id);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["booking"] ,exact: false, refetchType: "active"});
            // navigate.push("/bookings/" + data?.data?.bookings?.id);
        },
        onError: () => promise.reject(),
    });
    const isCheckingIn = status === "pending";
    return { checkin, isCheckingIn, Tpromise };
}
