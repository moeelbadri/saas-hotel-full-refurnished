import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { addStorageActivity} from "@/services/apiStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function useAddStorageActivity() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate, status, reset} = useMutation({
        mutationFn: ({ id, newItemData, isReplinching }: { id: number; newItemData: any; isReplinching: boolean }) => addStorageActivity(id, newItemData, isReplinching),
        onMutate: () => {
            toast.promise(Tpromise, {
                loading: Language==="en"?"Adding Activity":"جاري اضافة عملية",
                success: Language==="en"?"New Activity successfully created":"تم انشاء عملية جديدة بنجاح",
                error: (err: { message: string }) => Language==="en" ? `Failed to add Activity : ${err.message}` : `فشل اضافة عملية : ${err.message}`,
            });  
        },
        onSuccess: () => {
            promise.resolve();
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({queryKey: ["StorageActivties"],exact:false,refetchType:"active"});  
            
            setTimeout(() => reset(), 1000);         
        },
        onError: (err: { message: string }) => {
            promise.reject(err.message);
        },
    });

    const isAdding = status === "pending";
    return {
        addActivity: mutate,
        isAdding,
        Tpromise,
    };
}

export default useAddStorageActivity;
