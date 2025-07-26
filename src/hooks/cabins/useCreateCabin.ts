import { createEditCabin } from "@/services/apiCabins";
import { Cabin } from "@/utils/types";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useCreateCabin() {
    const queryClient = useQueryClient();
     const Language = useSettingsStore(state => state.Language);
    
    const { mutate, status } = useMutation({
        mutationFn: (newCabinData: Cabin) => createEditCabin(newCabinData),
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Creating cabin in progress... " : "جاري انشاء الغرفة...",
                success : Language==="en"?`New Room successfully created`:`تم انشاء غرفة جديد بنجاح`,
                error : Language==="en"?"There was an error while creating cabin":"حدث خطأ اثناء انشاء الغرفة"
            })
        },
        onSuccess: (data) => {
            promise.resolve(data);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["cabins"] });
        },
        onError: (err: { message: string }) => {
            promise.reject();
            toast.error(err.message);
        },
    });
    const isLoading = status === "pending";
    return {
        createCabin: mutate,
        isLoading,
        Tpromise,
    };
}

export default useCreateCabin;
