import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { deleteStorageItem} from "@/services/apiStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useDeleteStorageItem() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate, status } = useMutation({
        mutationFn:(newItemData:any)=>deleteStorageItem(newItemData),
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Deleting storage item in progress... " : "جاري حذف عنصر التخزين...",
                success : Language==="en"?`Item successfully Deleted`:`تم حذف العنصر بنجاح`,
                error : Language==="en"?"There was an error while deleting storage item":"حدث خطأ اثناء حذف عنصر التخزين"
            })
        },
        onSuccess: (data) => {
            promise.resolve(data);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({ queryKey: ["StorageActivties"],exact:false,refetchType:"active"});
            queryClient.invalidateQueries({queryKey: ["StorageItems"],exact:false,refetchType:"active"});
        },
        onError: (err: { message: string }) => {
            promise.reject();
        },
    });

    const isDeleting = status === "pending";
    return {
        deleteItem: mutate,
         isDeleting,
        Tpromise,
    };
}

export default useDeleteStorageItem;
