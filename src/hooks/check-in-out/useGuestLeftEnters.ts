import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GuestLeftEnters } from "@/services/apiBookings";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

//GuestLeftEnters(id: any, obj: any) 
export default function useGuestLeftEnters() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const Language = useSettingsStore(state => state.Language);
 
    const { mutate: LeftEnters, status } = useMutation({
        mutationFn:GuestLeftEnters,
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Processing guest exit in progress... " : "جاري معالجة خروج الضيف...",
                success : (guestId:any)=>Language==="en"?`Guest #${guestId} successfully left`:`تم خروج الضيف #${guestId} بنجاح`,
                error : Language==="en"?"There was an error while processing guest exit":"حدث خطأ اثناء معالجة خروج الضيف"
            })
        },
        onSuccess: (data) => {
            promise.resolve(data?.data?.bookings?.[0]?.guest_id);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["booking"] ,exact: false, refetchType: "active"});
        },

        onError: (err) => {
            promise.reject();
            toast.error(Language==="en"?"There was an error while processing guest exit":"حدث خطأ اثناء معالجة خروج الضيف");
        },
    });

    const isLoading = status === "pending";
    return { LeftEnters, isLoading, Tpromise };
}
