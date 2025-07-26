import { deleteCabin } from "@/services/apiCabins";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useDeleteCabin() {
    const Language = useSettingsStore(state => state.Language);
    const queryClient = useQueryClient();
    
    const { mutate, status } = useMutation({
        mutationFn: (id: number) => deleteCabin(id),
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Deleting cabin in progress... " : "جاري حذف الغرفة...",
                success : Language==="en"?`Room deleted successfully`:`تم حذف الغرفة بنجاح`,
                error : Language==="en"?"There was an error while deleting cabin":"حدث خطأ اثناء حذف الغرفة"
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
        onError: (error: { message: string }) => {
            promise.reject();
            toast.error(error.message);
        },
    });
    const isDeleting = status === "pending";
    return {
        deleteCabin: mutate,
        isDeleting,
        Tpromise,
    };
}

export default useDeleteCabin;
