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

function useEditCabin() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate, status } = useMutation({
        mutationFn: ({
            cabinData,
            cabinId,
        }: {
            cabinData: Cabin;
            cabinId: any;
        }) => createEditCabin(cabinData, cabinId),
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Editing cabin in progress... " : "جاري تعديل الغرفة...",
                success : Language==="en"?`Room successfully edited`:`تم تعديل الغرفة بنجاح`,
                error : Language==="en"?"There was an error while editing cabin":"حدث خطأ اثناء تعديل الغرفة"
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
        editCabin: mutate,
        isEditing: isLoading,
        Tpromise,
    };
}

export default useEditCabin;
