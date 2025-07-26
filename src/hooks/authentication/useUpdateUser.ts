import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateCurrentUser } from "@/services/apiAuth";
import { useSettingsStore } from "@/components/WizardForm/useStore";

const promise = {} as any;
let Tpromise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
});

export default function useUpdateUser() {
    const queryClient = useQueryClient();
    const Language = useSettingsStore(state => state.Language);
    
    const { mutate: updateUser, status ,  } = useMutation({
        mutationFn: updateCurrentUser,
        onMutate: (e) => {
            toast.promise(Tpromise,{
                loading : Language==="en"?"Updating user in progress... " : "جاري تحديث المستخدم...",
                success : Language==="en"?`User account successfully updated`:`تم تحديث حساب المستخدم بنجاح`,
                error : Language==="en"?"There was an error while updating user":"حدث خطأ اثناء تحديث المستخدم"
            })
        },
        onSuccess: ({ user }) => {
            promise.resolve({ user });
            Tpromise = new Promise((resolve, reject) => {
                promise.resolve = resolve;
                promise.reject = reject;
            });
            queryClient.setQueryData(["user"], user);
        },
        onError: (err: any) => {
            promise.reject();
            toast.error(err.message);
        },
    });

    const isLoading = status === "pending";
    return { updateUser, isLoading, Tpromise };
}
