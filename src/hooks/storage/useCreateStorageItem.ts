import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { EditCreateStorageItem} from "@/services/apiStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useCreateEditStorageItem() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate, status } = useMutation({
        mutationFn: (newItemData: any) => EditCreateStorageItem(newItemData),
        onMutate: (data) => {
            console.log(data)
            toast.promise(Tpromise, {
                loading: Language==="en"?"Editing Item":"جاري اضافة العنصر",
                success: Language==="en"?"New Item successfully created":"تم انشاء عنصر جديد بنجاح",
                error: (err: { message: string }) => Language==="en" ? `Failed to add Item : ${err.message}` : `فشل في اضافة العنصر : ${err.message}`,
            })  
        },
        onSuccess: () => {
            promise.resolve();
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({
                queryKey: ["StorageActivties"],exact:false,refetchType:"active",
            });
            queryClient.invalidateQueries({
                queryKey: ["StorageItems"],exact:false,refetchType:"active",
            });
        },
        onError: (err: { message: string }) => {
            promise.reject(err.message);
        },
    });

    const isLoading = status === "pending";
    return {
        createItem: mutate,
        isCreating: isLoading,
        Tpromise,
    };
}

export default useCreateEditStorageItem;
