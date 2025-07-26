"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {deleteStorageActivity} from "@/services/apiReports";
import { useSearchParams } from "next/navigation";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function usedeleteStorageActivity() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: DeleteStorageActivity,status,reset } = useMutation({
        mutationFn:(id:any)=>deleteStorageActivity(id),
        onMutate: (e) => {
            toast.promise(Tpromise, {
                loading: Language === "en" ? "Deleting Storage Activity..." : "جاري حذف العملية...",
                success: Language === "en" ? "Storage Activity successfully deleted" : "تم حدف العملية بنجاح",
                error: Language === "en" ? "There was an error while deleting Storage Activity" : "حدث خطاء اثناء حذف العملية",
            });
        },
        onSuccess: () => {
            promise.resolve();
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.invalidateQueries({
                queryKey: ["StorageReports"],exact:false,refetchType:"active",
            });
            queryClient.invalidateQueries({
                queryKey: ["StorageReportsWithUsers"],exact:false,refetchType:"active",
            });
        setTimeout(() => {
            reset();
        }, 1000);
        },
        onError: (err: { message: string }) => {promise.reject();},
    });
    const isDeleting = status === "pending";
    return { isDeleting, DeleteStorageActivity, Tpromise };
}
