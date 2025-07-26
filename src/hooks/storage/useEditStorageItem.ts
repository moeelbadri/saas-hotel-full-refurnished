import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { EditCreateStorageItem } from "@/services/apiStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

function usecreateEditStorageItem() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);

    const { mutate, status } = useMutation({
        mutationFn: (newItemData: any) => EditCreateStorageItem(newItemData),
        onMutate: (e) => {
            toast.promise(Tpromise, {
                loading: Language === "en" ? "Editing storage item in progress... " : "جاري تعديل عنصر التخزين...",
                success: Language === "en" ? `Item successfully edited` : `تم تعديل العنصر بنجاح`,
                error: Language === "en" ? "There was an error while editing storage item" : "حدث خطأ اثناء تعديل عنصر التخزين"
            })
        },
        onSuccess: (data) => {
            promise.resolve(data);
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({
                queryKey: ["StorageActivties"], exact: false, refetchType: "active",
            });
            queryClient.invalidateQueries({
                queryKey: ["StorageItem"], exact: false, refetchType: "active",
            });
            const queries = queryClient.getQueryCache().getAll();
            queries.forEach((element: any) => {
                if (element.queryKey[0] == 'StorageActivties')
                    queryClient.invalidateQueries(element.queryKey)
            })
        },
        onError: (err: { message: string }) => {
            promise.reject();
            toast.error(err.message);
        },
    });

    const isLoading = status === "pending";
    return {
        createItem: mutate,
        isCreating: isLoading,
        Tpromise,
    };
}

export default usecreateEditStorageItem;
