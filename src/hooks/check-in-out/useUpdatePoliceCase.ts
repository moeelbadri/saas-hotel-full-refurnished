import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePoliceCase } from "@/services/apiBookings";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useUpdatePoliceCase() {
    const Language = useSettingsStore(state => state.Language);
    const queryClient = useQueryClient();
    const router = useRouter();
    
    const { mutate:updatePoliceId , status} = useMutation({
        mutationFn: ({guestId,id,ids}:{guestId:any,id:any,ids:any}) => updatePoliceCase(guestId,id,ids),
        onMutate:(e)=>{
              toast.promise(Tpromise,{
                loading : Language==="en"? "Updating Police Case ID...":"جاري تحديث رقم ملف الشرطة...",
                success : Language==="en"? "Police Case ID updated": "تم تحديث رقم ملف الشرطة" ,
                error: (error) => Language==="en"? `Failed to update police case id : ${error.message}` : `فشل تحديث رقم ملف الشرطة : ${error.message}`
              })
        },
        onSuccess: (data) => {
            promise.resolve(data)
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["booking"] ,exact: false, refetchType: "active"});
        },
        onError: (error) => {
            promise.reject(error)
        }
    });

    const isLoading = status === "pending";
    return { updatePoliceId , isLoading, Tpromise};
}
