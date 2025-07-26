import { useMutation, useQueryClient } from "@tanstack/react-query";
import { payment } from "@/services/apiBookings";
import { toast } from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { useSettingsStore } from "@/components/WizardForm/useStore";
    const promise = {} as any;
    let Tpromise = new Promise((resolve, reject) => {
        promise.resolve = resolve;
        promise.reject = reject;
    });
export default function usePay() {
    const Language = useSettingsStore(state => state.Language);
    const queryClient = useQueryClient();

    const { mutate: pay, status} = useMutation({
        mutationFn: (data : any) => payment(data.amount,data.bookingId,data.info),
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Processing payment in progress... " : "جاري معالجة الدفع...",
                success : (data:any)=>Language==="en"?`Booking #${data} has been successfully Paid`:`تم  تأكيد الدفع للحجز #${data} بنجاح`,
                error : Language==="en"?"There was an error while Paying":"حدث خطأ اثناء الدفع"
            })
        },
        onSuccess: (data) => {
            promise.resolve(data?.data?.bookings?.[0]?.id)
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            })
            queryClient.invalidateQueries({ queryKey: ["booking"] ,exact: false, refetchType: "active"});
        },

        onError: (err) => {
            promise.reject();
        },
    });

    const isPaying = status === "pending";
    return { pay, isPaying, Tpromise};
}
